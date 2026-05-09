import type { MemoryInventoryDatabase } from "./memoryDatabase";
import type { Inventory, InventoryKind } from "../domain/types";

interface CreateInventoryInput {
  id: string;
  kind: InventoryKind;
  name: string;
  householdId?: string;
}

export function createInventoryRepository(db?: MemoryInventoryDatabase) {
  const inventories = db?.inventories ?? new Map<string, Inventory>();

  return {
    async createInventory(input: CreateInventoryInput): Promise<Inventory> {
      const now = new Date().toISOString();
      const inventory: Inventory = {
        id: input.id,
        kind: input.kind,
        name: input.name.trim(),
        householdId: input.householdId,
        syncScope: input.householdId ? "shared" : "local",
        createdAt: now,
        updatedAt: now,
      };

      inventories.set(inventory.id, inventory);
      return inventory;
    },
    async getInventory(id: string): Promise<Inventory | undefined> {
      return inventories.get(id);
    },
    async listInventories(): Promise<Inventory[]> {
      return Array.from(inventories.values()).sort((a, b) => a.name.localeCompare(b.name));
    },
  };
}
