import { DashboardScreen } from "../../src/inventory/ui/screens/DashboardScreen";
import { useLocalInventory } from "../../src/inventory/ui/useLocalInventory";

export default function DashboardRoute() {
  const inventory = useLocalInventory();
  return <DashboardScreen inventories={inventory.inventories} items={inventory.items} totalValueCents={inventory.totalValueCents} />;
}
