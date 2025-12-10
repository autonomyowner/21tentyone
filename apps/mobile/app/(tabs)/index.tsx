import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#fefdfb' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: '#2d3a2e' }}>
            Welcome to Matcha
          </Text>
          <Text style={{ color: '#a69889', marginTop: 4 }}>
            AI at the service of your mind
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#5a9470', borderRadius: 12, paddingVertical: 16 }}
            onPress={() => router.push('/chat/new')}
          >
            <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
              Start Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#dcedde', borderRadius: 12, paddingVertical: 16 }}
            onPress={() => router.push('/flash-session')}
          >
            <Text style={{ color: '#3d654c', fontWeight: '600', textAlign: 'center' }}>
              Flash Session
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f5ebe0' }}>
          <Text style={{ fontWeight: '600', color: '#2d3a2e', fontSize: 18, marginBottom: 12 }}>
            Your Progress
          </Text>
          <View style={{ height: 8, backgroundColor: '#f5ebe0', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ width: '35%', height: '100%', backgroundColor: '#5a9470', borderRadius: 4 }} />
          </View>
          <Text style={{ color: '#a69889', marginTop: 8 }}>35% profile complete</Text>
        </View>

        {/* Patterns Card */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f5ebe0' }}>
          <Text style={{ fontWeight: '600', color: '#2d3a2e', fontSize: 18, marginBottom: 12 }}>
            Thinking Patterns
          </Text>
          {['Analytical', 'Emotional', 'Pragmatic', 'Creative'].map((pattern, i) => (
            <View key={pattern} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: '#5a5347' }}>{pattern}</Text>
                <Text style={{ color: '#5a9470', fontWeight: '500' }}>{25 + i * 5}%</Text>
              </View>
              <View style={{ height: 6, backgroundColor: '#f5ebe0', borderRadius: 3 }}>
                <View style={{ width: `${25 + i * 5}%`, height: '100%', backgroundColor: '#5a9470', borderRadius: 3 }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
