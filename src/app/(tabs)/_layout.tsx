import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#637a5e",
        tabBarInactiveTintColor: "#a1a1a1",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "explore",
          tabBarLabel: "explore",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          tabBarLabel: "profile",
        }}
      />
    </Tabs>
  );
}
