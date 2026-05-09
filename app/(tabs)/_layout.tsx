import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "../../src/inventory/ui/ThemeProvider";

export default function TabLayout() {
  const { theme } = useTheme();
  const palette = theme.palette;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.faint,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.line,
          minHeight: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="home-outline" size={size} /> }} />
      <Tabs.Screen name="inventories" options={{ title: "Inventories", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="albums-outline" size={size} /> }} />
      <Tabs.Screen name="add" options={{ title: "Add", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="scan-outline" size={size} /> }} />
      <Tabs.Screen name="household" options={{ title: "Household", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="people-outline" size={size} /> }} />
    </Tabs>
  );
}
