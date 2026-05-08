import { Text, View } from "react-native";
import { createInventorySupabaseClient } from "../../sync/supabaseClient";

export function HouseholdScreen() {
  const supabaseEnabled = Boolean(createInventorySupabaseClient());

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Household</Text>
      <Text>{supabaseEnabled ? "Cloud sync is configured." : "Cloud sync is not configured on this device."}</Text>
      <Text>Shared inventories can be enabled after sign-in.</Text>
      <Text>Local-only inventories remain private.</Text>
    </View>
  );
}
