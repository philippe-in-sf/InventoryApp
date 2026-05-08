import type { BarcodeKind, Inventory, InventoryItem, ItemBarcode, ItemDraft } from "../domain/types";
import type { MemoryInventoryDatabase } from "./memoryDatabase";
import { createInventoryRepository } from "./inventoryRepository";
import { createItemRepository } from "./itemRepository";

export type LocalItemDraft = ItemDraft & { barcode?: string };

export interface LocalInventoryStore {
  saveDraft(draft: LocalItemDraft): Promise<InventoryItem>;
  listInventories(): Promise<Inventory[]>;
  listItems(): Promise<InventoryItem[]>;
}

const DEFAULT_HOME_ID = "default-home";

export function createLocalInventoryStore(db: MemoryInventoryDatabase): LocalInventoryStore {
  const inventoryRepository = createInventoryRepository(db);
  const itemRepository = createItemRepository(db);

  async function ensureDefaultInventory(): Promise<Inventory> {
    const existing = await inventoryRepository.getInventory(DEFAULT_HOME_ID);
    if (existing) return existing;

    return inventoryRepository.createInventory({
      id: DEFAULT_HOME_ID,
      kind: "home",
      name: "Home inventory",
    });
  }

  return {
    async saveDraft(draft) {
      const inventory = await ensureDefaultInventory();
      return itemRepository.saveItem({
        ...draft,
        id: createId("item"),
        inventoryId: inventory.id,
        barcodes: draft.barcode ? [toBarcode(draft.barcode)] : [],
      });
    },
    async listInventories() {
      return inventoryRepository.listInventories();
    },
    async listItems() {
      return itemRepository.listItems();
    },
  };
}

function toBarcode(code: string): ItemBarcode {
  return {
    code: code.trim(),
    kind: inferBarcodeKind(code),
  };
}

function inferBarcodeKind(code: string): BarcodeKind {
  const normalized = code.replace(/[^0-9X]/gi, "");
  if (normalized.length === 10 || (normalized.length === 13 && normalized.startsWith("978"))) return "ISBN";
  if (normalized.length === 13) return "EAN";
  return "UPC";
}

function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10);
  return prefix + "-" + Date.now().toString(36) + "-" + random;
}
