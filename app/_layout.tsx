import { Stack } from "expo-router";
import { ThemeProvider } from "../src/inventory/ui/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
