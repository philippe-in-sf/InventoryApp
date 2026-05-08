import { Alert } from "react-native";
import { createLookupService } from "../../src/inventory/lookup/lookupService";
import { openFoodFactsProvider, openLibraryProvider } from "../../src/inventory/lookup/providers";
import { AddItemScreen } from "../../src/inventory/ui/screens/AddItemScreen";

const lookupService = createLookupService([openLibraryProvider, openFoodFactsProvider]);

export default function AddRoute() {
  return (
    <AddItemScreen
      lookup={lookupService.lookup}
      onSave={(draft) => {
        Alert.alert("Saved locally", `${draft.name || "Unnamed item"} is ready to save to the local database.`);
      }}
    />
  );
}
