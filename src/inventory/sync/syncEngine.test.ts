import { describe, expect, it, vi } from "vitest";
import { createSyncEngine } from "./syncEngine";

describe("sync engine", () => {
  it("does not sync when cloud client is missing", async () => {
    const engine = createSyncEngine({ client: undefined, getDirtyItems: async () => [] });
    const result = await engine.syncInventory("inventory-1");

    expect(result).toEqual({ status: "skipped", reason: "Cloud sync is not configured." });
  });

  it("pushes dirty items when cloud client is configured", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const client = {
      from: () => ({ upsert }),
    };
    const engine = createSyncEngine({
      client,
      getDirtyItems: async () => [{ id: "item-1", name: "Lamp", inventoryId: "inventory-1" }],
    });

    const result = await engine.syncInventory("inventory-1");

    expect(result.status).toBe("synced");
    expect(upsert).toHaveBeenCalledWith([{ id: "item-1", name: "Lamp", inventory_id: "inventory-1" }]);
  });
});
