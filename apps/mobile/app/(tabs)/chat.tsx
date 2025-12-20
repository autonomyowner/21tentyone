import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient, Conversation } from '../../lib/api';
import { isTestMode } from '../../lib/auth';

// Safe auth hook for test mode
function useSafeAuth() {
  if (isTestMode) {
    return {
      getToken: async () => 'test-token',
      isSignedIn: true,
      isLoaded: true,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useAuth } = require('@clerk/clerk-expo');
  return useAuth();
}

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

// Guest prompt component
function GuestPrompt() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#E8E9ED', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Ionicons name="chatbubbles-outline" size={48} color="#2E1020" />
      </View>

      <Text style={{ fontFamily: 'DMSerifDisplay_400Regular', fontSize: 24, color: '#2E1020', textAlign: 'center', marginBottom: 8 }}>
        AI-Powered Conversations
      </Text>

      <Text style={{ color: '#9FB3C8', textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
        Chat with our AI companion to process your thoughts, understand emotions, and gain personalized insights.
      </Text>

      <View style={{ width: '100%', gap: 12 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#2E1020', borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Create Free Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: 'white', borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E8E9ED' }}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={{ color: '#2E1020', fontWeight: '600', fontSize: 16 }}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 32, padding: 16, backgroundColor: '#F5F5F7', borderRadius: 12, width: '100%' }}>
        <Text style={{ color: '#9FB3C8', fontWeight: '600', marginBottom: 8 }}>Why sign up?</Text>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={16} color="#2E1020" />
            <Text style={{ color: '#9FB3C8', marginLeft: 8 }}>Save your conversations</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={16} color="#2E1020" />
            <Text style={{ color: '#9FB3C8', marginLeft: 8 }}>Track emotional patterns over time</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={16} color="#2E1020" />
            <Text style={{ color: '#9FB3C8', marginLeft: 8 }}>Get personalized AI analysis</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={16} color="#2E1020" />
            <Text style={{ color: '#9FB3C8', marginLeft: 8 }}>Sync across devices</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ChatListScreen() {
  const router = useRouter();
  const { getToken, isSignedIn, isLoaded } = useSafeAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);

  const fetchConversations = useCallback(async (force = false) => {
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    // In test mode, skip API calls and show empty list
    if (isTestMode) {
      setIsLoading(false);
      setConversations([]);
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
    if (isLoaded) {
      if (isSignedIn) {
        fetchConversations(true).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }
  }, [isSignedIn, isLoaded]);

  // Refetch when app comes to foreground (skip in test mode)
  useEffect(() => {
    if (isTestMode) return;
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
    if (!isSignedIn) {
      router.push('/(auth)/login');
      return;
    }

    // In test mode, go directly to new chat
    if (isTestMode) {
      router.push('/chat/new');
      return;
    }

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

  // Show loading while auth is being determined
  if (!isLoaded || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2E1020" />
      </View>
    );
  }

  // Show guest prompt if not signed in
  if (!isSignedIn) {
    return <GuestPrompt />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E8E9ED' }}>
        <Text style={{ color: '#9FB3C8' }}>{conversations.length} conversations</Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E1020', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}
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
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#2E1020" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E8E9ED', backgroundColor: 'white' }}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontWeight: '600', color: '#2E1020', flex: 1 }} numberOfLines={1}>
                {item.title || 'New conversation'}
              </Text>
              <Text style={{ color: '#C0C2D3', fontSize: 12 }}>{formatTimeAgo(item.updatedAt)}</Text>
            </View>
            {item.emotionalState?.primary && (
              <Text style={{ color: '#9FB3C8' }} numberOfLines={1}>
                Feeling: {item.emotionalState.primary}
              </Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, marginTop: 60 }}>
            <Ionicons name={error ? "alert-circle-outline" : "chatbubbles-outline"} size={64} color={error ? "#2E1020" : "#C0C2D3"} />
            <Text style={{ fontWeight: '600', color: '#2E1020', fontSize: 18, marginTop: 16 }}>
              {error || 'No conversations yet'}
            </Text>
            <Text style={{ color: '#9FB3C8', textAlign: 'center', marginTop: 8 }}>
              {error ? 'Pull down to retry or tap the button below.' : 'Start a new chat to begin exploring your thoughts.'}
            </Text>
            {error && (
              <TouchableOpacity
                style={{ marginTop: 16, backgroundColor: '#2E1020', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 }}
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
