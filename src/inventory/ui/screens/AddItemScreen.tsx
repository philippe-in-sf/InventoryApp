import { useState } from "react";
import { Button, Text, View } from "react-native";
import type { ItemDraft } from "../../domain/types";
import type { LookupService } from "../../lookup/lookupService";
import { ItemField } from "../components/ItemField";

interface AddItemScreenProps {
  onSave(draft: ItemDraft & { barcode?: string }): void;
  lookup: LookupService["lookup"];
}

export function AddItemScreen({ onSave, lookup }: AddItemScreenProps) {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [message, setMessage] = useState("");

  async function handleLookup() {
    const result = await lookup(barcode);
    if (result.status === "found") {
      setName(result.fields.name);
      setMessage(`Matched from ${result.source ?? "lookup provider"}. Review before saving.`);
      return;
    }

    setMessage("No match found. The code is saved for manual entry.");
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Add item</Text>
      <ItemField label="Barcode" value={barcode} onChangeText={setBarcode} />
      <Button title="Look up" onPress={handleLookup} />
      <ItemField label="Name" value={name} onChangeText={setName} />
      {message ? <Text>{message}</Text> : null}
      <Button title="Save item" onPress={() => onSave({ name, categoryId: "general", barcode })} />
    </View>
  );
}
