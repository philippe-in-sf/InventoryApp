import { Text, View } from "react-native";

export function DashboardScreen() {
  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Inventory</Text>
      <Text>Recent inventories</Text>
      <Text>Sync status: local-first, cloud sync optional</Text>
      <Text>Quick add is available from the Add tab.</Text>
    </View>
  );
}
