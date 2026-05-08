import { Text, View } from "react-native";

export default function DashboardRoute() {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Inventory</Text>
      <Text style={{ marginTop: 8, fontSize: 16 }}>
        Local-first home and collection inventory.
      </Text>
    </View>
  );
}
