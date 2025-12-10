import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-12 pb-8">
            {/* Logo */}
            <View className="items-center mb-12">
              <Text className="font-serif text-4xl text-matcha-600">Matcha</Text>
              <Text className="text-warm-600 mt-2">AI at the service of your mind</Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <Text className="font-sans-semibold text-2xl text-warm-900 mb-6">
                Welcome back
              </Text>

              {error ? (
                <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <Text className="text-red-600">{error}</Text>
                </View>
              ) : null}

              <View>
                <Text className="text-warm-700 mb-2 font-sans-medium">Email</Text>
                <TextInput
                  className="bg-white border border-warm-200 rounded-xl px-4 py-3 text-warm-900"
                  placeholder="your@email.com"
                  placeholderTextColor="#a69889"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View>
                <Text className="text-warm-700 mb-2 font-sans-medium">Password</Text>
                <TextInput
                  className="bg-white border border-warm-200 rounded-xl px-4 py-3 text-warm-900"
                  placeholder="Enter your password"
                  placeholderTextColor="#a69889"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>

              <TouchableOpacity
                className={`bg-matcha-600 rounded-xl py-4 mt-6 ${isLoading ? 'opacity-70' : ''}`}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-sans-semibold text-lg">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-warm-600">Don't have an account? </Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text className="text-matcha-600 font-sans-semibold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
