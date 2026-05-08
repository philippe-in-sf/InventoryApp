import { StyleSheet, Text, View } from "react-native";
import { createInventorySupabaseClient } from "../../sync/supabaseClient";
import { Card, ListRow, ScreenShell, SectionHeader } from "../components/DesignSystem";
import { palette, radii, spacing } from "../theme";

export function HouseholdScreen() {
  const supabaseEnabled = Boolean(createInventorySupabaseClient());

  return (
    <ScreenShell
      eyebrow="Sharing"
      title="Household"
      subtitle="Keep inventories private by default, then connect a shared cloud database when the household is ready."
    >
      <Card tone={supabaseEnabled ? "soft" : "dark"}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, supabaseEnabled && styles.statusDotOn]} />
          <Text style={[styles.statusText, !supabaseEnabled && styles.statusTextDark]}>
            {supabaseEnabled ? "Cloud sync is configured" : "Cloud sync is not configured"}
          </Text>
        </View>
        <Text style={[styles.copy, !supabaseEnabled && styles.copyDark]}>
          {supabaseEnabled
            ? "This device can connect local inventories to the shared database."
            : "Everything you add remains local on this device until cloud sync is connected."}
        </Text>
      </Card>

      <Card>
        <SectionHeader title="Collaboration model" />
        <ListRow detail="Private inventories stay readable and editable offline." marker={<Text style={styles.marker}>1</Text>} title="Local first" />
        <ListRow detail="A household database can share selected rooms or collections later." marker={<Text style={styles.marker}>2</Text>} title="Share selectively" />
        <ListRow detail="Conflicts are resolved by newest edit unless a field needs review." marker={<Text style={styles.marker}>3</Text>} title="Sync safely" />
      </Card>

      <Card tone="soft">
        <SectionHeader title="Next setup step" />
        <Text style={styles.copy}>
          Add sign-in and household invites after the local capture flow is stable. That keeps the first version focused on making inventory entry fast and trustworthy.
        </Text>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  statusDot: {
    backgroundColor: palette.accent,
    borderRadius: radii.sm,
    height: 14,
    width: 14,
  },
  statusDotOn: {
    backgroundColor: palette.primary,
  },
  statusText: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  statusTextDark: {
    color: palette.surface,
  },
  copy: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  copyDark: {
    color: "#d8e2df",
  },
  marker: {
    color: palette.accent,
    fontWeight: "900",
  },
});
