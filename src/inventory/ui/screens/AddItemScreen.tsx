import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ItemDraft } from "../../domain/types";
import type { LookupService } from "../../lookup/lookupService";
import { ActionButton, Card, Pill, ScreenShell, SectionHeader } from "../components/DesignSystem";
import { ItemField } from "../components/ItemField";
import { useTheme } from "../ThemeProvider";
import { radii, spacing } from "../theme";

interface AddItemScreenProps {
  onSave(draft: ItemDraft & { barcode?: string }): unknown | Promise<unknown>;
  lookup: LookupService["lookup"];
}

export function AddItemScreen({ onSave, lookup }: AddItemScreenProps) {
  const { theme } = useTheme();
  const palette = theme.palette;
  const styles = createStyles(palette);
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [message, setMessage] = useState("");
  const [categoryId, setCategoryId] = useState("general");
  const [saving, setSaving] = useState(false);

  async function handleLookup() {
    const result = await lookup(barcode);
    if (result.status === "found") {
      setName(result.fields.name);
      setMessage(`Matched from ${result.source ?? "lookup provider"}. Review before saving.`);
      return;
    }

    setMessage("No match found. The code is saved for manual entry.");
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({ name, categoryId, barcode });
      setName("");
      setBarcode("");
      setCategoryId("general");
      setMessage("Saved to your local inventory.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenShell
      eyebrow="Capture"
      title="Add item"
      subtitle="Scan a UPC or ISBN when possible, then fill only the fields that make the item useful later."
    >
      <Card tone="dark">
        <View style={styles.scanFrame}>
          <View style={styles.scanCorner} />
          <Text style={styles.scanText}>Camera scan ready</Text>
          <Text style={styles.scanCopy}>Use the phone camera in the native app, or type a code below on web.</Text>
        </View>
        <ItemField label="Barcode or ISBN" value={barcode} onChangeText={setBarcode} />
        <ActionButton title="Look up code" onPress={handleLookup} />
        {message ? <Text style={styles.lookupMessage}>{message}</Text> : null}
      </Card>

      <Card>
        <SectionHeader title="Item details" />
        <View style={styles.categoryBar}>
          <Pill selected={categoryId === "general"} onPress={() => setCategoryId("general")}>General</Pill>
          <Pill selected={categoryId === "books"} onPress={() => setCategoryId("books")}>Book</Pill>
          <Pill selected={categoryId === "electronics"} onPress={() => setCategoryId("electronics")}>Electronics</Pill>
          <Pill selected={categoryId === "collectibles"} onPress={() => setCategoryId("collectibles")}>Collectible</Pill>
        </View>
        <ItemField label="Name" value={name} onChangeText={setName} />
        <View style={styles.fieldPreview}>
          <Text style={styles.previewTitle}>Suggested fields</Text>
          <Text style={styles.previewCopy}>
            Books can track title, author, topic, condition, and value. Electronics can track maker, device type, model, serial number, and value.
          </Text>
        </View>
        <ActionButton title={saving ? "Saving..." : "Save item"} onPress={handleSave} />
      </Card>
    </ScreenShell>
  );
}

function createStyles(palette: typeof import("../theme").palette) {
  return StyleSheet.create({
  scanFrame: {
    alignItems: "center",
    borderColor: "#6f9690",
    borderRadius: radii.lg,
    borderStyle: "dashed",
    borderWidth: 1,
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 170,
    padding: spacing.xl,
  },
  scanCorner: {
    backgroundColor: palette.accent,
    borderRadius: radii.sm,
    height: 34,
    width: 80,
  },
  scanText: {
    color: palette.heroText,
    fontSize: 20,
    fontWeight: "800",
  },
  scanCopy: {
    color: palette.heroMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  lookupMessage: {
    color: palette.goldSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  categoryBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  fieldPreview: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: radii.md,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  previewTitle: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "800",
  },
  previewCopy: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  });
}
