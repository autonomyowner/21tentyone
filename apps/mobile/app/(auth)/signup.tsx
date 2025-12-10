import { useSignUp } from '@clerk/clerk-expo';
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

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Verification failed');
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
                {pendingVerification ? 'Verify your email' : 'Create account'}
              </Text>

              {error ? (
                <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <Text className="text-red-600">{error}</Text>
                </View>
              ) : null}

              {!pendingVerification ? (
                <>
                  <View>
                    <Text className="text-warm-700 mb-2 font-sans-medium">First Name</Text>
                    <TextInput
                      className="bg-white border border-warm-200 rounded-xl px-4 py-3 text-warm-900"
                      placeholder="Your name"
                      placeholderTextColor="#a69889"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>

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
                      placeholder="Create a password"
                      placeholderTextColor="#a69889"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      autoComplete="password-new"
                    />
                  </View>

                  <TouchableOpacity
                    className={`bg-matcha-600 rounded-xl py-4 mt-6 ${isLoading ? 'opacity-70' : ''}`}
                    onPress={handleSignUp}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-center font-sans-semibold text-lg">
                        Create Account
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text className="text-warm-600 mb-4">
                    We sent a verification code to {email}
                  </Text>

                  <View>
                    <Text className="text-warm-700 mb-2 font-sans-medium">
                      Verification Code
                    </Text>
                    <TextInput
                      className="bg-white border border-warm-200 rounded-xl px-4 py-3 text-warm-900 text-center text-2xl tracking-widest"
                      placeholder="000000"
                      placeholderTextColor="#a69889"
                      value={code}
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>

                  <TouchableOpacity
                    className={`bg-matcha-600 rounded-xl py-4 mt-6 ${isLoading ? 'opacity-70' : ''}`}
                    onPress={handleVerify}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-center font-sans-semibold text-lg">
                        Verify Email
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-warm-600">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-matcha-600 font-sans-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
