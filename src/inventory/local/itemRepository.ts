import type { FakeSqlite } from "../../test/fakeSqlite";
import type { InventoryItem, ItemDraft } from "../domain/types";

export interface ItemRepository {
  saveItem(input: ItemDraft & { id: string; inventoryId: string }): Promise<InventoryItem>;
  getItem(id: string): Promise<InventoryItem | undefined>;
}

export function createItemRepository(db: FakeSqlite): ItemRepository {
  return {
    async saveItem(input) {
      const now = new Date().toISOString();
      const item: InventoryItem = {
        id: input.id,
        inventoryId: input.inventoryId,
        name: input.name.trim(),
        categoryId: input.categoryId,
        quantity: Math.max(1, input.quantity ?? 1),
        photos: [],
        barcodes: [],
        approximateValueCents: Math.max(0, input.approximateValueCents ?? 0),
        customFields: input.customFields ?? {},
        syncScope: "local",
        syncState: "dirty",
        createdAt: now,
        updatedAt: now,
      };

      db.items.set(item.id, item);
      db.queue.push({
        id: `queue-${item.id}-${now}`,
        entityType: "item",
        entityId: item.id,
        operation: "upsert",
        createdAt: now,
      });

      return item;
    },
    async getItem(id) {
      return db.items.get(id) as InventoryItem | undefined;
    },
  };
}
