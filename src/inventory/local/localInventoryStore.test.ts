import { describe, expect, it } from "vitest";
import { createFakeSqlite } from "../../test/fakeSqlite";
import { createLocalInventoryStore } from "./localInventoryStore";

describe("local inventory store", () => {
  it("creates a default local inventory when saving the first item", async () => {
    const store = createLocalInventoryStore(createFakeSqlite());

    await store.saveDraft({ name: "Desk lamp", categoryId: "general", barcode: "012345678905" });

    const inventories = await store.listInventories();
    expect(inventories).toHaveLength(1);
    expect(inventories[0]).toMatchObject({
      id: "default-home",
      kind: "home",
      name: "Home inventory",
      syncScope: "local",
    });
  });

  it("lists saved local items with their barcode and category", async () => {
    const store = createLocalInventoryStore(createFakeSqlite());

    await store.saveDraft({ name: "Dune", categoryId: "books", barcode: "9780441172719" });

    const items = await store.listItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      name: "Dune",
      categoryId: "books",
      inventoryId: "default-home",
      barcodes: [{ code: "9780441172719", kind: "ISBN" }],
      syncState: "dirty",
    });
  });
});
