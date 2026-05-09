import { StyleSheet, Text, View } from "react-native";
import type { Inventory, InventoryItem } from "../../domain/types";
import { Card, ListRow, MetricCard, Pill, ScreenShell, SectionHeader } from "../components/DesignSystem";
import { useTheme } from "../ThemeProvider";
import { spacing } from "../theme";

interface InventoriesScreenProps {
  inventories?: Inventory[];
  items?: InventoryItem[];
}

export function InventoriesScreen({ inventories = [], items = [] }: InventoriesScreenProps) {
  const { theme } = useTheme();
  const palette = theme.palette;
  const styles = createStyles(palette);
  const collections = inventories.filter((inventory) => inventory.kind === "collection");
  const homeInventories = inventories.filter((inventory) => inventory.kind === "home");

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
        <MetricCard detail="Local home inventories" label="Rooms" tone="green" value={String(homeInventories.length)} />
        <MetricCard detail="Books, electronics, art" label="Collections" tone="blue" value={String(collections.length)} />
      </View>

      <Card>
        <SectionHeader action="New room" title="Home inventory" />
        {homeInventories.length ? (
          homeInventories.map((inventory) => (
            <ListRow key={inventory.id} detail={`${items.length} item${items.length === 1 ? "" : "s"} saved locally`} marker={<Text style={styles.marker}>H</Text>} meta={inventory.syncScope} title={inventory.name} />
          ))
        ) : (
          <>
            <ListRow detail="Walk room by room and capture furniture, appliances, electronics, and valuables." marker={<Text style={styles.marker}>1</Text>} meta="Template" title="Main residence" />
            <ListRow detail="Use areas like attic, garage, storage, and closets for less visible items." marker={<Text style={styles.marker}>2</Text>} meta="Suggested" title="Storage areas" />
          </>
        )}
      </Card>

      <Card>
        <SectionHeader action="New collection" title="Saved items" />
        {items.length ? (
          items.map((item) => (
            <ListRow key={item.id} detail={`${item.categoryId}${item.barcodes[0] ? ` · ${item.barcodes[0].kind} ${item.barcodes[0].code}` : ""}`} marker={<Text style={styles.marker}>{item.categoryId.slice(0, 1).toUpperCase()}</Text>} meta={formatCurrency(item.approximateValueCents)} title={item.name || "Untitled item"} />
          ))
        ) : (
          <>
            <ListRow detail="Title, author, topic or theme, condition, and approximate value." marker={<Text style={styles.marker}>B</Text>} meta="Books" title="Library" />
            <ListRow detail="Maker, device type, model, serial number, purchase date, and value." marker={<Text style={styles.marker}>E</Text>} meta="Electronics" title="Devices" />
            <ListRow detail="Custom fields for maker, provenance, condition, appraisal notes, and photos." marker={<Text style={styles.marker}>A</Text>} meta="Custom" title="Art and collectibles" />
          </>
        )}
      </Card>
    </ScreenShell>
  );
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", { currency: "USD", maximumFractionDigits: 0, style: "currency" }).format(cents / 100);
}

function createStyles(palette: typeof import("../theme").palette) {
  return StyleSheet.create({
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
}
