import { Redirect } from 'expo-router';

export default function Index() {
  // For now, go directly to tabs (bypass auth)
  return <Redirect href="/(tabs)" />;
}
