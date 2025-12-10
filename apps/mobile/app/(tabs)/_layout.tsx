import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fefdfb',
        },
        headerTitleStyle: {
          fontFamily: 'DMSerifDisplay_400Regular',
          fontSize: 20,
          color: '#2d3a2e',
        },
        tabBarStyle: {
          backgroundColor: '#fefdfb',
          borderTopColor: 'rgba(104, 166, 125, 0.15)',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#5a9470',
        tabBarInactiveTintColor: '#a69889',
        tabBarLabelStyle: {
          fontFamily: 'DMSans_500Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'Matcha',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
