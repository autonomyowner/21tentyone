import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../stores/userStore';
import { useNotifications } from '../../hooks/useNotifications';
import { isTestMode, testUser } from '../../lib/auth';

// Safe auth hooks that work in test mode
function useSafeAuth() {
  if (isTestMode) {
    return { signOut: async () => {}, isSignedIn: true, isLoaded: true };
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useAuth } = require('@clerk/clerk-expo');
  return useAuth();
}

function useSafeUser() {
  if (isTestMode) {
    return { user: testUser };
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useUser } = require('@clerk/clerk-expo');
  return useUser();
}

function SettingItem({ icon, title, subtitle, onPress, rightElement }: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E8E9ED' }}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8E9ED', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon as any} size={20} color="#2E1020" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontWeight: '500', color: '#2E1020' }}>{title}</Text>
        {subtitle && <Text style={{ color: '#9FB3C8', fontSize: 14 }}>{subtitle}</Text>}
      </View>
      {rightElement ? rightElement : onPress && <Ionicons name="chevron-forward" size={20} color="#C0C2D3" />}
    </TouchableOpacity>
  );
}

// Guest profile header
function GuestHeader() {
  const router = useRouter();

  return (
    <View style={{ alignItems: 'center', padding: 24, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E8E9ED' }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8E9ED', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Ionicons name="person-outline" size={36} color="#9FB3C8" />
      </View>
      <Text style={{ fontSize: 20, fontWeight: '600', color: '#2E1020' }}>Guest User</Text>
      <Text style={{ color: '#9FB3C8', marginTop: 4 }}>Sign in to save your data</Text>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16, width: '100%' }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#2E1020', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'white', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2E1020' }}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={{ color: '#2E1020', fontWeight: '600' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Authenticated user header
function AuthHeader() {
  const { user } = useSafeUser();

  const userEmail = user?.emailAddresses[0]?.emailAddress || 'user@example.com';
  const userName = user?.firstName || 'Twenty One User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <View style={{ alignItems: 'center', padding: 24, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E8E9ED' }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8E9ED', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 32, fontFamily: 'DMSerifDisplay_400Regular', color: '#2E1020' }}>{userInitial}</Text>
      </View>
      <Text style={{ fontSize: 20, fontWeight: '600', color: '#2E1020' }}>{userName}</Text>
      <Text style={{ color: '#9FB3C8' }}>{userEmail}</Text>
      <View style={{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12, backgroundColor: '#E8E9ED' }}>
        <Text style={{ fontWeight: '600', color: '#9FB3C8' }}>FREE Plan</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { signOut, isSignedIn, isLoaded } = useSafeAuth();
  const { user } = useSafeUser();
  const router = useRouter();
  const {
    totalMessages,
    totalSessions,
    currentStreak,
    longestStreak,
    resetUserData,
  } = useUserStore();
  const {
    settings: notificationSettings,
    permissionGranted,
    isLoading: notificationsLoading,
    isSaving: notificationsSaving,
    toggleNotifications,
    toggleStreakWarnings,
    toggleMotivational,
    sendTestNotification,
  } = useNotifications();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will clear all your mood history, streaks, and preferences. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetUserData();
            Alert.alert('Done', 'Your data has been reset.');
          },
        },
      ]
    );
  };

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView>
        {/* Header - different for guest vs authenticated */}
        {isSignedIn ? <AuthHeader /> : <GuestHeader />}

        {/* Upgrade prompt - only for authenticated users */}
        {isSignedIn && (
          <TouchableOpacity
            style={{ margin: 16, backgroundColor: '#2E1020', borderRadius: 16, padding: 16 }}
            onPress={() => Alert.alert('Upgrade', 'Upgrade feature coming soon!')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Upgrade to Pro</Text>
                <Text style={{ color: '#C0C2D3', marginTop: 4 }}>to get access to the 21day protocol</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>$35/mo</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Stats - available for everyone (local data) */}
        <View style={{ paddingHorizontal: 16, marginTop: isSignedIn ? 0 : 16, marginBottom: 8 }}>
          <Text style={{ color: '#9FB3C8', fontWeight: '500', fontSize: 12, textTransform: 'uppercase' }}>Your Stats</Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E8E9ED' }}>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16, borderRightWidth: 1, borderRightColor: '#E8E9ED' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2E1020' }}>{totalMessages}</Text>
            <Text style={{ color: '#9FB3C8', fontSize: 14 }}>Messages</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16, borderRightWidth: 1, borderRightColor: '#E8E9ED' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2E1020' }}>{totalSessions}</Text>
            <Text style={{ color: '#9FB3C8', fontSize: 14 }}>Sessions</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#9FB3C8' }}>{currentStreak}</Text>
            <Text style={{ color: '#9FB3C8', fontSize: 14 }}>Day Streak</Text>
          </View>
        </View>

        {longestStreak > 0 && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F5F5F7', borderBottomWidth: 1, borderBottomColor: '#E8E9ED' }}>
            <Text style={{ color: '#9FB3C8', textAlign: 'center' }}>
              Best streak: {longestStreak} days
            </Text>
          </View>
        )}

        {/* Guest benefits prompt */}
        {!isSignedIn && (
          <View style={{ margin: 16, padding: 16, backgroundColor: '#E8E9ED', borderRadius: 12 }}>
            <Text style={{ color: '#2E1020', fontWeight: '600', marginBottom: 8 }}>
              Create an account to unlock:
            </Text>
            <View style={{ gap: 6 }}>
              <Text style={{ color: '#2E1020' }}>- AI chat conversations</Text>
              <Text style={{ color: '#2E1020' }}>- Emotional analysis & insights</Text>
              <Text style={{ color: '#2E1020' }}>- Cloud backup of your data</Text>
              <Text style={{ color: '#2E1020' }}>- Sync across all devices</Text>
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 8 }}>
          <Text style={{ color: '#9FB3C8', fontWeight: '500', fontSize: 12, textTransform: 'uppercase' }}>Notifications</Text>
        </View>
        {!permissionGranted && (
          <View style={{ backgroundColor: '#F5F5F7', padding: 12, marginHorizontal: 16, borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ color: '#9FB3C8', fontSize: 13 }}>
              Enable notifications in your device settings to receive reminders.
            </Text>
          </View>
        )}
        <SettingItem
          icon="notifications-outline"
          title="Push Notifications"
          subtitle="Daily reminders and updates"
          rightElement={
            <Switch
              value={notificationSettings?.enabled ?? false}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#E8E9ED', true: '#2E1020' }}
              thumbColor="white"
              disabled={!permissionGranted || notificationsLoading || notificationsSaving}
            />
          }
        />
        <SettingItem
          icon="flame-outline"
          title="Streak Reminders"
          subtitle="Don't lose your streak"
          rightElement={
            <Switch
              value={notificationSettings?.streakWarningsEnabled ?? false}
              onValueChange={toggleStreakWarnings}
              trackColor={{ false: '#E8E9ED', true: '#2E1020' }}
              thumbColor="white"
              disabled={!permissionGranted || !notificationSettings?.enabled || notificationsLoading || notificationsSaving}
            />
          }
        />
        <SettingItem
          icon="heart-outline"
          title="Daily Motivation"
          subtitle="Uplifting messages"
          rightElement={
            <Switch
              value={notificationSettings?.motivationalEnabled ?? false}
              onValueChange={toggleMotivational}
              trackColor={{ false: '#E8E9ED', true: '#2E1020' }}
              thumbColor="white"
              disabled={!permissionGranted || !notificationSettings?.enabled || notificationsLoading || notificationsSaving}
            />
          }
        />
        <SettingItem
          icon="paper-plane-outline"
          title="Test Notification"
          subtitle="Send a test notification"
          onPress={() => {
            sendTestNotification();
            Alert.alert('Sent!', 'Check your notifications.');
          }}
        />

        {/* Account section - only for authenticated users */}
        {isSignedIn && (
          <>
            <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 8 }}>
              <Text style={{ color: '#9FB3C8', fontWeight: '500', fontSize: 12, textTransform: 'uppercase' }}>Account</Text>
            </View>
            {memberSince && (
              <SettingItem icon="person-outline" title="Member Since" subtitle={memberSince} />
            )}
            <SettingItem icon="mail-outline" title="Email" subtitle={user?.emailAddresses[0]?.emailAddress} />
          </>
        )}

        <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 8 }}>
          <Text style={{ color: '#9FB3C8', fontWeight: '500', fontSize: 12, textTransform: 'uppercase' }}>Support</Text>
        </View>
        <SettingItem icon="help-circle-outline" title="Help and FAQ" onPress={() => Alert.alert('Help', 'Help section coming soon!')} />
        <SettingItem icon="document-text-outline" title="Terms of Service" onPress={() => router.push('/terms')} />
        <SettingItem icon="shield-outline" title="Privacy Policy" onPress={() => router.push('/privacy')} />

        <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 8 }}>
          <Text style={{ color: '#9FB3C8', fontWeight: '500', fontSize: 12, textTransform: 'uppercase' }}>Danger Zone</Text>
        </View>
        <SettingItem icon="trash-outline" title="Reset Local Data" subtitle="Clear mood history and streaks" onPress={handleResetData} />

        {/* Sign out - only for authenticated users */}
        {isSignedIn && (
          <TouchableOpacity
            style={{ margin: 16, padding: 16, backgroundColor: '#FAF5F7', borderRadius: 12, alignItems: 'center' }}
            onPress={handleSignOut}
          >
            <Text style={{ color: '#2E1020', fontWeight: '600' }}>Sign Out</Text>
          </TouchableOpacity>
        )}

        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Text style={{ color: '#C0C2D3' }}>21|Twenty One® v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
