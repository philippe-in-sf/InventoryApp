import { describe, expect, it } from "vitest";
import type { InventoryItem } from "../domain/types";
import { mergeItemLastWriterWins } from "./conflicts";

function item(id: string, updatedAt: string, name: string): InventoryItem {
  return {
    id,
    inventoryId: "inventory-1",
    name,
    categoryId: "general",
    quantity: 1,
    photos: [],
    barcodes: [],
    approximateValueCents: 0,
    customFields: {},
    syncScope: "shared",
    syncState: "clean",
    createdAt: "2026-05-08T00:00:00.000Z",
    updatedAt,
  };
}

describe("sync conflicts", () => {
  it("keeps the most recently updated item fields", () => {
    const local = item("item-1", "2026-05-08T10:00:00.000Z", "Local name");
    const remote = item("item-1", "2026-05-08T11:00:00.000Z", "Remote name");

    expect(mergeItemLastWriterWins(local, remote).name).toBe("Remote name");
  });

  it("preserves additive photos from both sides", () => {
    const local = { ...item("item-1", "2026-05-08T12:00:00.000Z", "Camera"), photos: ["local.jpg"] };
    const remote = { ...item("item-1", "2026-05-08T11:00:00.000Z", "Camera"), photos: ["remote.jpg"] };

    expect(mergeItemLastWriterWins(local, remote).photos).toEqual(["local.jpg", "remote.jpg"]);
  });
});
