import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { createApiClient, Conversation } from '../../lib/api';

// Global throttle to prevent multiple instances from fetching
let globalLastFetch = 0;

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function ChatListScreen() {
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);

  const fetchConversations = useCallback(async (force = false) => {
    if (!isSignedIn) {
      setError('Please sign in to view conversations');
      return;
    }

    // Prevent concurrent fetches
    if (isFetching.current) return;

    // Global throttle: 5 seconds between fetches (unless forced)
    const now = Date.now();
    if (!force && now - globalLastFetch < 5000) {
      return;
    }

    try {
      isFetching.current = true;
      setError(null);
      const token = await getToken();

      if (!token) {
        setError('Authentication failed - please sign in again');
        return;
      }

      globalLastFetch = now;
      const api = createApiClient(getToken);
      const response = await api.getConversations();
      setConversations(response.data.conversations || []);
    } catch (err: any) {
      if (err?.response?.status === 429) {
        // Rate limited - silently ignore, use cached data
        return;
      }
      console.error('Failed to fetch conversations:', err?.response?.status, err?.response?.data || err?.message);
      if (err?.response?.status === 401) {
        setError('Session expired - please sign in again');
      } else if (err?.response?.status === 404) {
        setConversations([]);
      } else if (conversations.length === 0) {
        // Only show error if we have no cached data
        setError('Unable to load conversations');
      }
    } finally {
      isFetching.current = false;
    }
  }, [getToken, isSignedIn, conversations.length]);

  // Initial fetch only
  useEffect(() => {
    if (isSignedIn) {
      fetchConversations(true).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  // Refetch when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isSignedIn && !isLoading) {
        fetchConversations();
      }
    });
    return () => subscription.remove();
  }, [isSignedIn, isLoading]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchConversations(true);
    setIsRefreshing(false);
  };

  const handleNewChat = async () => {
    try {
      const api = createApiClient(getToken);
      const response = await api.createConversation();
      router.push(`/chat/${response.data.id}`);
    } catch (err) {
      console.error('Failed to create conversation:', err);
      // Navigate to new chat anyway - it will create on first message
      router.push('/chat/new');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fefdfb', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#5a9470" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fefdfb' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0' }}>
        <Text style={{ color: '#a69889' }}>{conversations.length} conversations</Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#5a9470', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}
          onPress={handleNewChat}
        >
          <Ionicons name="add" size={18} color="white" />
          <Text style={{ color: 'white', fontWeight: '500', marginLeft: 4 }}>New Chat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#5a9470" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', backgroundColor: 'white' }}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontWeight: '600', color: '#2d3a2e', flex: 1 }} numberOfLines={1}>
                {item.title || 'New conversation'}
              </Text>
              <Text style={{ color: '#d9d0c5', fontSize: 12 }}>{formatTimeAgo(item.updatedAt)}</Text>
            </View>
            {item.emotionalState?.primary && (
              <Text style={{ color: '#a69889' }} numberOfLines={1}>
                Feeling: {item.emotionalState.primary}
              </Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, marginTop: 60 }}>
            <Ionicons name={error ? "alert-circle-outline" : "chatbubbles-outline"} size={64} color={error ? "#e57373" : "#d9d0c5"} />
            <Text style={{ fontWeight: '600', color: '#2d3a2e', fontSize: 18, marginTop: 16 }}>
              {error || 'No conversations yet'}
            </Text>
            <Text style={{ color: '#a69889', textAlign: 'center', marginTop: 8 }}>
              {error ? 'Pull down to retry or tap the button below.' : 'Start a new chat to begin exploring your thoughts.'}
            </Text>
            {error && (
              <TouchableOpacity
                style={{ marginTop: 16, backgroundColor: '#5a9470', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 }}
                onPress={() => {
                  setIsLoading(true);
                  fetchConversations(true).finally(() => setIsLoading(false));
                }}
              >
                <Text style={{ color: 'white', fontWeight: '500' }}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}
