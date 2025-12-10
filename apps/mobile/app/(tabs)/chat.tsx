import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { createApiClient, Conversation } from '../../lib/api';

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
  const { getToken } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const api = createApiClient(getToken);
      const response = await api.getConversations();
      setConversations(response.data.conversations || []);
    } catch (err) {
      console.log('No conversations yet or API unavailable');
      setConversations([]);
    }
  }, [getToken]);

  useEffect(() => {
    fetchConversations().finally(() => setIsLoading(false));
  }, [fetchConversations]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchConversations();
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fefdfb', alignItems: 'center', justifyContent: 'center' }} edges={['bottom']}>
        <ActivityIndicator size="large" color="#5a9470" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefdfb' }} edges={['bottom']}>
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
            <Ionicons name="chatbubbles-outline" size={64} color="#d9d0c5" />
            <Text style={{ fontWeight: '600', color: '#2d3a2e', fontSize: 18, marginTop: 16 }}>No conversations yet</Text>
            <Text style={{ color: '#a69889', textAlign: 'center', marginTop: 8 }}>
              Start a new chat to begin exploring your thoughts.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
