import * as SecureStore from 'expo-secure-store';
import { TokenCache } from '@clerk/clerk-expo';

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        return item;
      } catch (error) {
        console.error('SecureStore getToken error:', error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: async (key: string, token: string) => {
      try {
        await SecureStore.setItemAsync(key, token);
      } catch (error) {
        console.error('SecureStore saveToken error:', error);
      }
    },
  };
};

export const tokenCache = createTokenCache();

// Test mode check
export const isTestMode = !process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Mock user for test mode
export const testUser = {
  id: 'test-user-123',
  firstName: 'Test',
  lastName: 'User',
  fullName: 'Test User',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  primaryEmailAddress: { emailAddress: 'test@example.com' },
  imageUrl: null,
  createdAt: new Date().toISOString(),
};
