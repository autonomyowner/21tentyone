import { View, Text, ScrollView } from 'react-native';

export default function ProtocolScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: '#2E1020' }}>
            21 Day Protocol
          </Text>
          <Text style={{ color: '#9FB3C8', marginTop: 4 }}>
            Your journey to mental wellness
          </Text>
        </View>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E8E9ED' }}>
          <Text style={{ fontWeight: '600', color: '#2E1020', fontSize: 18, marginBottom: 12 }}>
            Coming Soon
          </Text>
          <Text style={{ color: '#9FB3C8', lineHeight: 22 }}>
            The 21 Day Protocol is a structured program designed to help you build lasting mental wellness habits.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
