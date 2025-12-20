import { Redirect, Stack } from 'expo-router';
import { isTestMode } from '../../lib/auth';

// Safe auth hook for test mode
function useSafeAuth() {
  if (isTestMode) {
    return { isSignedIn: true };
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useAuth } = require('@clerk/clerk-expo');
  return useAuth();
}

export default function AuthLayout() {
  const { isSignedIn } = useSafeAuth();

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
