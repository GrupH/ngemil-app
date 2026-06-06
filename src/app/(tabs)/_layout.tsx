import Navbar from '@/components/Navbar';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View className="flex-1">
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <Navbar />
    </View>
  );
}