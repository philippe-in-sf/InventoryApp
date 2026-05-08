import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Inventory, InventoryItem } from "../domain/types";
import { createLocalInventoryStore, type LocalItemDraft } from "./localInventoryStore";
import { createMemoryInventoryDatabase } from "./memoryDatabase";

const STORAGE_KEY = "inventory-app.local-store.v1";
const db = createMemoryInventoryDatabase();
const store = createLocalInventoryStore(db);
const listeners = new Set<() => void>();
let hydratePromise: Promise<void> | undefined;

interface PersistedState {
  inventories: Inventory[];
  items: InventoryItem[];
}

export interface LocalInventorySnapshot extends PersistedState {
  totalValueCents: number;
}

export function subscribeToLocalInventory(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function getLocalInventorySnapshot(): Promise<LocalInventorySnapshot> {
  await hydrate();
  const [inventories, items] = await Promise.all([store.listInventories(), store.listItems()]);
  return {
    inventories,
    items,
    totalValueCents: items.reduce((total, item) => total + item.approximateValueCents, 0),
  };
}

export async function saveLocalInventoryDraft(draft: LocalItemDraft): Promise<InventoryItem> {
  await hydrate();
  const item = await store.saveDraft(draft);
  await persist();
  notify();
  return item;
}

async function hydrate(): Promise<void> {
  hydratePromise ??= loadPersistedState();
  return hydratePromise;
}

async function loadPersistedState(): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const parsed = JSON.parse(raw) as PersistedState;
  db.inventories.clear();
  db.items.clear();

  for (const inventory of parsed.inventories ?? []) {
    db.inventories.set(inventory.id, inventory);
  }

  for (const item of parsed.items ?? []) {
    db.items.set(item.id, item as unknown as Record<string, unknown>);
  }
}

async function persist(): Promise<void> {
  const [inventories, items] = await Promise.all([store.listInventories(), store.listItems()]);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ inventories, items }));
}

function notify() {
  for (const listener of listeners) listener();
}
