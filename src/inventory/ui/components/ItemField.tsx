import { Text, TextInput, View } from "react-native";

interface ItemFieldProps {
  label: string;
  value: string;
  onChangeText(value: string): void;
}

export function ItemField({ label, value, onChangeText }: ItemFieldProps) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: "600" }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        style={{ borderWidth: 1, borderColor: "#bbb", borderRadius: 8, padding: 12 }}
      />
    </View>
  );
}
