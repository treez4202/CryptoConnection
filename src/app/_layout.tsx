import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#0b0b16',
          borderTopColor: '#222',
        },
        headerStyle: {
          backgroundColor: '#0b0b16',
        },
        headerTintColor: '#FFD700',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: 'Markets',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'News',
        }}
      />
    </Tabs>
  );
}
