import { StyleSheet, Text, View } from "react-native";
import { Card, ListRow, MetricCard, Pill, ScreenShell, SectionHeader } from "../components/DesignSystem";
import { palette, spacing } from "../theme";

export function InventoriesScreen() {
  return (
    <ScreenShell
      eyebrow="Organize"
      title="Inventories"
      subtitle="Separate home spaces from collections, then filter by what you need to find, value, insure, or share."
    >
      <View style={styles.filterBar}>
        <Pill selected>All</Pill>
        <Pill>Rooms</Pill>
        <Pill>Collections</Pill>
        <Pill>High value</Pill>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard detail="Ready to create" label="Rooms" tone="green" value="0" />
        <MetricCard detail="Books, electronics, art" label="Collections" tone="blue" value="0" />
      </View>

      <Card>
        <SectionHeader action="New room" title="Home inventory" />
        <ListRow detail="Walk room by room and capture furniture, appliances, electronics, and valuables." marker={<Text style={styles.marker}>1</Text>} meta="Template" title="Main residence" />
        <ListRow detail="Use areas like attic, garage, storage, and closets for less visible items." marker={<Text style={styles.marker}>2</Text>} meta="Suggested" title="Storage areas" />
      </Card>

      <Card>
        <SectionHeader action="New collection" title="Collections" />
        <ListRow detail="Title, author, topic or theme, condition, and approximate value." marker={<Text style={styles.marker}>B</Text>} meta="Books" title="Library" />
        <ListRow detail="Maker, device type, model, serial number, purchase date, and value." marker={<Text style={styles.marker}>E</Text>} meta="Electronics" title="Devices" />
        <ListRow detail="Custom fields for maker, provenance, condition, appraisal notes, and photos." marker={<Text style={styles.marker}>A</Text>} meta="Custom" title="Art and collectibles" />
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  marker: {
    color: palette.accent,
    fontWeight: "900",
  },
});
