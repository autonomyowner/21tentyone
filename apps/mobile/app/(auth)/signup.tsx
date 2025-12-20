import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { Link, useRouter, Redirect } from 'expo-router';
import { useState, useCallback } from 'react';
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
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { isTestMode } from '../../lib/auth';

WebBrowser.maybeCompleteAuthSession();

// In test mode, just redirect to tabs
export default function SignUpScreen() {
  if (isTestMode) {
    return <Redirect href="/(tabs)" />;
  }
  return <SignUpScreenContent />;
}

function SignUpScreenContent() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<'google' | 'facebook' | null>(null);
  const [error, setError] = useState('');

  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startFacebookOAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const handleOAuth = useCallback(async (provider: 'google' | 'facebook') => {
    try {
      setIsOAuthLoading(provider);
      setError('');
      const startOAuth = provider === 'google' ? startGoogleOAuth : startFacebookOAuth;
      const { createdSessionId, setActive: setOAuthActive } = await startOAuth({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: 'twentyone' }),
      });
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('OAuth error:', err);
      setError(err.errors?.[0]?.message || 'Failed to sign up with ' + provider);
    } finally {
      setIsOAuthLoading(null);
    }
  }, [startGoogleOAuth, startFacebookOAuth, router]);

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
    <SafeAreaView className="flex-1 bg-neutral-50">
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
              <Text className="font-serif text-4xl text-brand-800">21|Twenty One®</Text>
              <Text className="text-steel-400 mt-2">AI at the service of your mind</Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <Text className="font-sans-semibold text-2xl text-brand-800 mb-6">
                {pendingVerification ? 'Verify your email' : 'Create account'}
              </Text>

              {error ? (
                <View className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-4">
                  <Text className="text-brand-800">{error}</Text>
                </View>
              ) : null}

              {!pendingVerification ? (
                <>
                  {/* OAuth Buttons */}
                  <View style={{ marginBottom: 24 }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FFFFFF',
                        borderWidth: 1,
                        borderColor: '#E8E9ED',
                        borderRadius: 12,
                        paddingVertical: 14,
                        marginBottom: 12,
                      }}
                      onPress={() => handleOAuth('google')}
                      disabled={isOAuthLoading !== null || isLoading}
                    >
                      {isOAuthLoading === 'google' ? (
                        <ActivityIndicator color="#2E1020" />
                      ) : (
                        <>
                          <Text style={{ fontSize: 18, marginRight: 12, fontWeight: 'bold', color: '#4285F4' }}>G</Text>
                          <Text style={{ color: '#2E1020', fontWeight: '500', fontSize: 16 }}>Continue with Google</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1877F2',
                        borderRadius: 12,
                        paddingVertical: 14,
                      }}
                      onPress={() => handleOAuth('facebook')}
                      disabled={isOAuthLoading !== null || isLoading}
                    >
                      {isOAuthLoading === 'facebook' ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <>
                          <Text style={{ fontSize: 18, color: 'white', marginRight: 12, fontWeight: 'bold' }}>f</Text>
                          <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Continue with Facebook</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Divider */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#E8E9ED' }} />
                    <Text style={{ marginHorizontal: 16, color: '#9FB3C8' }}>or</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#E8E9ED' }} />
                  </View>

                  <View>
                    <Text className="text-steel-400 mb-2 font-sans-medium">First Name</Text>
                    <TextInput
                      className="bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-brand-800"
                      placeholder="Your name"
                      placeholderTextColor="#C0C2D3"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View>
                    <Text className="text-steel-400 mb-2 font-sans-medium">Email</Text>
                    <TextInput
                      className="bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-brand-800"
                      placeholder="your@email.com"
                      placeholderTextColor="#C0C2D3"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>

                  <View>
                    <Text className="text-steel-400 mb-2 font-sans-medium">Password</Text>
                    <TextInput
                      className="bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-brand-800"
                      placeholder="Create a password"
                      placeholderTextColor="#C0C2D3"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      autoComplete="password-new"
                    />
                  </View>

                  <TouchableOpacity
                    className={`bg-brand-800 rounded-xl py-4 mt-6 ${isLoading || isOAuthLoading ? 'opacity-70' : ''}`}
                    onPress={handleSignUp}
                    disabled={isLoading || isOAuthLoading !== null}
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
                  <Text className="text-steel-400 mb-4">
                    We sent a verification code to {email}
                  </Text>

                  <View>
                    <Text className="text-steel-400 mb-2 font-sans-medium">
                      Verification Code
                    </Text>
                    <TextInput
                      className="bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-brand-800 text-center text-2xl tracking-widest"
                      placeholder="000000"
                      placeholderTextColor="#C0C2D3"
                      value={code}
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>

                  <TouchableOpacity
                    className={`bg-brand-800 rounded-xl py-4 mt-6 ${isLoading ? 'opacity-70' : ''}`}
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
              <Text className="text-steel-400">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-brand-800 font-sans-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
