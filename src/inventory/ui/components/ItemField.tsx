import { StyleSheet, Text, TextInput, View } from "react-native";
import { palette, radii, spacing, type } from "../theme";

interface ItemFieldProps {
  label: string;
  value: string;
  onChangeText(value: string): void;
}

export function ItemField({ label, value, onChangeText }: ItemFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={palette.faint}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  label: {
    color: palette.ink,
    fontSize: type.label,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: radii.md,
    borderWidth: 1,
    color: palette.ink,
    fontSize: type.body,
    minHeight: 50,
    paddingHorizontal: spacing.lg,
  },
});
