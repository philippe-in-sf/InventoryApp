export type InventoryKind = "home" | "collection";
export type SyncScope = "local" | "shared";
export type BarcodeKind = "UPC" | "EAN" | "ISBN";

export type CustomFieldType = "text" | "number" | "currency" | "date" | "select";

export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[];
}

export interface CategoryTemplate {
  id: string;
  label: string;
  fields: CustomFieldDefinition[];
}

export interface Inventory {
  id: string;
  kind: InventoryKind;
  name: string;
  householdId?: string;
  syncScope: SyncScope;
  createdAt: string;
  updatedAt: string;
}

export interface ItemBarcode {
  kind: BarcodeKind;
  code: string;
}

export interface InventoryItem {
  id: string;
  inventoryId: string;
  name: string;
  categoryId: string;
  locationId?: string;
  quantity: number;
  photos: string[];
  barcodes: ItemBarcode[];
  description?: string;
  approximateValueCents: number;
  purchaseDate?: string;
  purchasePriceCents?: number;
  condition?: string;
  customFields: Record<string, string | number | boolean | null>;
  syncScope: SyncScope;
  syncState: "clean" | "dirty" | "syncing" | "error";
  createdAt: string;
  updatedAt: string;
  lastUpdatedBy?: string;
}

export interface ItemDraft {
  name: string;
  categoryId: string;
  quantity?: number;
  approximateValueCents?: number;
  customFields?: Record<string, string | number | boolean | null>;
}
