import { describe, expect, it } from "vitest";
import { createInventoryRepository } from "./inventoryRepository";

describe("inventory repository", () => {
  it("creates home and collection inventories locally", async () => {
    const repo = createInventoryRepository();

    const home = await repo.createInventory({ id: "home-1", kind: "home", name: "House" });
    const collection = await repo.createInventory({ id: "collection-1", kind: "collection", name: "Books" });

    expect(home.syncScope).toBe("local");
    expect(collection.kind).toBe("collection");
    expect(await repo.listInventories()).toHaveLength(2);
  });
});
