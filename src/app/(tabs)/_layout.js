import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1e293b' },
        headerTintColor: '#ffffff',
        tabBarStyle: { backgroundColor: '#1e293b', height: 60, paddingBottom: 8 },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      {/* 1 st Tab : Events list */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Campus Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2 nd tab:- Favorites / Bookmarks */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'My Bookmarks',
          tabBarLabel: 'Bookmarks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}