import { Text, View } from "react-native";

export function InventoriesScreen() {
  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Inventories</Text>
      <Text>Home inventory: organize by property, room, or area.</Text>
      <Text>Collections: books, electronics, tools, collectibles, art, media, or custom.</Text>
      <Text>Search, filters, item counts, and estimated values will read from the local database.</Text>
    </View>
  );
}
