import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import type { Inventory, InventoryItem } from "../../domain/types";
import { ActionButton, Card, ListRow, MetricCard, ScreenShell, SectionHeader } from "../components/DesignSystem";
import { palette, radii, spacing } from "../theme";

interface DashboardScreenProps {
  inventories?: Inventory[];
  items?: InventoryItem[];
  totalValueCents?: number;
}

export function DashboardScreen({ inventories = [], items = [], totalValueCents = 0 }: DashboardScreenProps) {
  const router = useRouter();
  const recentItems = items.slice(0, 3);

  return (
    <ScreenShell
      eyebrow="Local first inventory"
      title="Know what you own."
      subtitle="Catalog rooms, collections, electronics, books, and valuables with a private local database by default."
    >
      <Card tone="dark">
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>I</Text>
          </View>
          <Text style={styles.heroStatus}>{items.length ? `${items.length} saved locally` : "Cloud sync optional"}</Text>
        </View>
        <Text style={styles.heroTitle}>{items.length ? "Your local inventory is taking shape." : "Home inventory, ready for the first walkthrough."}</Text>
        <Text style={styles.heroCopy}>
          Start with a room, scan a code when one exists, then enrich the item with the fields that matter.
        </Text>
        <View style={styles.heroActions}>
          <ActionButton title="Add first item" onPress={() => router.push("/add")} />
          <ActionButton title="Create collection" variant="secondary" onPress={() => router.push("/inventories")} />
        </View>
      </Card>

      <View style={styles.metricsGrid}>
        <MetricCard detail="Estimated value tracked" label="Portfolio" tone="green" value={formatCurrency(totalValueCents)} />
        <MetricCard detail="Rooms and collections" label="Inventories" tone="blue" value={String(inventories.length)} />
        <MetricCard detail="Items saved locally" label="Items" tone="gold" value={String(items.length)} />
      </View>

      <Card>
        <SectionHeader action={items.length ? "Latest first" : "View all"} title={items.length ? "Recently added" : "Starter paths"} />
        {recentItems.length ? (
          recentItems.map((item) => (
            <ListRow
              key={item.id}
              detail={`${item.categoryId} · Qty ${item.quantity}${item.barcodes[0] ? ` · ${item.barcodes[0].code}` : ""}`}
              marker={<Text style={styles.markerText}>{item.categoryId.slice(0, 1).toUpperCase()}</Text>}
              meta={formatCurrency(item.approximateValueCents)}
              title={item.name || "Untitled item"}
            />
          ))
        ) : (
          <>
            <ListRow detail="Kitchen, living room, garage, bedrooms, and storage." marker={<Text style={styles.markerText}>H</Text>} meta="Room by room" title="Whole home walkthrough" />
            <ListRow detail="Books, electronics, tools, art, media, and collectibles." marker={<Text style={styles.markerText}>C</Text>} meta="Collections" title="Catalog a focused collection" />
            <ListRow detail="Save UPC, ISBN, maker, model, serial number, and value." marker={<Text style={styles.markerText}>S</Text>} meta="Scan or type" title="Quick item capture" />
          </>
        )}
      </Card>

      <Card tone="soft">
        <SectionHeader title="Privacy model" />
        <Text style={styles.bodyCopy}>
          Items stay on this device unless a shared household database is configured. That keeps the first version useful offline and ready for cloud collaboration later.
        </Text>
      </Card>
    </ScreenShell>
  );
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", { currency: "USD", maximumFractionDigits: 0, style: "currency" }).format(cents / 100);
}

const styles = StyleSheet.create({
  heroTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: palette.accent,
    borderRadius: radii.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  heroIconText: {
    color: palette.surface,
    fontSize: 22,
    fontWeight: "900",
  },
  heroStatus: {
    color: palette.goldSoft,
    fontSize: 13,
    fontWeight: "800",
  },
  heroTitle: {
    color: palette.surface,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  heroCopy: {
    color: "#d8e2df",
    fontSize: 15,
    lineHeight: 23,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  markerText: {
    color: palette.accent,
    fontWeight: "900",
  },
  bodyCopy: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 23,
  },
});
