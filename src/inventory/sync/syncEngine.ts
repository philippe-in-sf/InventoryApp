interface DirtyItem {
  id: string;
  inventoryId: string;
  name: string;
}

interface SupabaseLikeClient {
  from(table: string): {
    upsert(rows: Record<string, unknown>[]): Promise<{ error: { message: string } | null }>;
  };
}

interface SyncEngineOptions {
  client: SupabaseLikeClient | undefined;
  getDirtyItems(inventoryId: string): Promise<DirtyItem[]>;
}

export function createSyncEngine({ client, getDirtyItems }: SyncEngineOptions) {
  return {
    async syncInventory(inventoryId: string) {
      if (!client) {
        return { status: "skipped" as const, reason: "Cloud sync is not configured." };
      }

      const dirtyItems = await getDirtyItems(inventoryId);
      const rows = dirtyItems.map((item) => ({
        id: item.id,
        name: item.name,
        inventory_id: item.inventoryId,
      }));

      const { error } = await client.from("items").upsert(rows);
      if (error) {
        return { status: "error" as const, message: error.message };
      }

      return { status: "synced" as const, pushed: rows.length };
    },
  };
}
