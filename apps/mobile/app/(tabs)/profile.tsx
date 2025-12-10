import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

function SettingItem({ icon, title, subtitle, onPress }: { icon: string; title: string; subtitle?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f5ebe0' }}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#dcedde', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon as any} size={20} color="#5a9470" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontWeight: '500', color: '#2d3a2e' }}>{title}</Text>
        {subtitle && <Text style={{ color: '#a69889', fontSize: 14 }}>{subtitle}</Text>}
      </View>
      {onPress && <Ionicons name="chevron-forward" size={20} color="#d9d0c5" />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefdfb' }} edges={['bottom']}>
      <ScrollView>
        {/* Profile Header */}
        <View style={{ alignItems: 'center', padding: 24, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f5ebe0' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcedde', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 32, fontFamily: 'DMSerifDisplay_400Regular', color: '#5a9470' }}>M</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#2d3a2e' }}>Matcha User</Text>
          <Text style={{ color: '#a69889' }}>user@example.com</Text>
          <View style={{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f5ebe0' }}>
            <Text style={{ fontWeight: '600', color: '#5a5347' }}>FREE Plan</Text>
          </View>
        </View>

        {/* Upgrade Banner */}
        <TouchableOpacity
          style={{ margin: 16, backgroundColor: '#5a9470', borderRadius: 16, padding: 16 }}
          onPress={() => Alert.alert('Upgrade', 'Upgrade feature coming soon!')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Upgrade to Pro</Text>
              <Text style={{ color: '#dcedde', marginTop: 4 }}>Unlimited chats & deeper analysis</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>$15/mo</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Usage Stats */}
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={{ color: '#a69889', fontWeight: '500', fontSize: 12, textTransform: 'uppercase' }}>Usage This Month</Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f5ebe0' }}>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16, borderRightWidth: 1, borderRightColor: '#f5ebe0' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#5a9470' }}>12</Text>
            <Text style={{ color: '#a69889', fontSize: 14 }}>Messages</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#5a9470' }}>3</Text>
            <Text style={{ color: '#a69889', fontSize: 14 }}>Analyses</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 8 }}>
          <Text style={{ color: '#a69889', fontWeight: '500', fontSize: 12, textTransform: 'uppercase' }}>Account</Text>
        </View>
        <SettingItem icon="person-outline" title="Member Since" subtitle="December 2024" />
        <SettingItem icon="mail-outline" title="Email" subtitle="user@example.com" />

        <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 8 }}>
          <Text style={{ color: '#a69889', fontWeight: '500', fontSize: 12, textTransform: 'uppercase' }}>Support</Text>
        </View>
        <SettingItem icon="help-circle-outline" title="Help & FAQ" onPress={() => Alert.alert('Help', 'Help section coming soon!')} />
        <SettingItem icon="document-text-outline" title="Terms of Service" onPress={() => {}} />
        <SettingItem icon="shield-outline" title="Privacy Policy" onPress={() => {}} />

        {/* Sign Out */}
        <TouchableOpacity
          style={{ margin: 16, padding: 16, backgroundColor: '#fef2f2', borderRadius: 12, alignItems: 'center' }}
          onPress={() => Alert.alert('Sign Out', 'Sign out feature coming soon!')}
        >
          <Text style={{ color: '#dc2626', fontWeight: '600' }}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Text style={{ color: '#d9d0c5' }}>Matcha v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
