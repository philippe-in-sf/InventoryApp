import { createLookupService } from "../../src/inventory/lookup/lookupService";
import { openFoodFactsProvider, openLibraryProvider } from "../../src/inventory/lookup/providers";
import { AddItemScreen } from "../../src/inventory/ui/screens/AddItemScreen";
import { useLocalInventory } from "../../src/inventory/ui/useLocalInventory";

const lookupService = createLookupService([openLibraryProvider, openFoodFactsProvider]);

export default function AddRoute() {
  const inventory = useLocalInventory();

  return <AddItemScreen lookup={lookupService.lookup} onSave={inventory.saveDraft} />;
}
