import { InventoriesScreen } from "../../src/inventory/ui/screens/InventoriesScreen";
import { useLocalInventory } from "../../src/inventory/ui/useLocalInventory";

export default function InventoriesRoute() {
  const inventory = useLocalInventory();
  return <InventoriesScreen inventories={inventory.inventories} items={inventory.items} />;
}
