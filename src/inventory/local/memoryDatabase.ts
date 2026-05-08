import type { Inventory } from "../domain/types";

export interface MemoryInventoryDatabase {
  inventories: Map<string, Inventory>;
  items: Map<string, Record<string, unknown>>;
  queue: Record<string, unknown>[];
}

export function createMemoryInventoryDatabase(): MemoryInventoryDatabase {
  return {
    inventories: new Map(),
    items: new Map(),
    queue: [],
  };
}
