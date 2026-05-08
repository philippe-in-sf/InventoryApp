import { describe, expect, it } from "vitest";
import { createFakeSqlite } from "../../test/fakeSqlite";
import { createItemRepository } from "./itemRepository";

describe("item repository", () => {
  it("saves items as dirty local records", async () => {
    const db = createFakeSqlite();
    const repo = createItemRepository(db);

    await repo.saveItem({
      id: "item-1",
      inventoryId: "inventory-1",
      name: "Sony Receiver",
      categoryId: "electronics",
      quantity: 1,
      approximateValueCents: 12500,
      customFields: { maker: "Sony" },
    });

    const item = await repo.getItem("item-1");
    expect(item?.name).toBe("Sony Receiver");
    expect(item?.syncState).toBe("dirty");
    expect(item?.customFields).toEqual({ maker: "Sony" });
  });
});
