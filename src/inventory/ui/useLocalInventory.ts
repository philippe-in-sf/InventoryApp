import { useCallback, useEffect, useState } from "react";
import type { Inventory, InventoryItem } from "../domain/types";
import {
  getLocalInventorySnapshot,
  saveLocalInventoryDraft,
  subscribeToLocalInventory,
  type LocalInventorySnapshot,
} from "../local/appLocalInventoryStore";
import type { LocalItemDraft } from "../local/localInventoryStore";

const emptySnapshot: LocalInventorySnapshot = {
  inventories: [],
  items: [],
  totalValueCents: 0,
};

export function useLocalInventory(): LocalInventorySnapshot & {
  loading: boolean;
  refresh(): Promise<void>;
  saveDraft(draft: LocalItemDraft): Promise<InventoryItem>;
} {
  const [snapshot, setSnapshot] = useState<LocalInventorySnapshot>(emptySnapshot);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const nextSnapshot = await getLocalInventorySnapshot();
    setSnapshot(nextSnapshot);
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const nextSnapshot = await getLocalInventorySnapshot();
      if (!mounted) return;
      setSnapshot(nextSnapshot);
      setLoading(false);
    };

    const unsubscribe = subscribeToLocalInventory(() => {
      void load();
    });
    void load();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const saveDraft = useCallback(async (draft: LocalItemDraft) => {
    const item = await saveLocalInventoryDraft(draft);
    await refresh();
    return item;
  }, [refresh]);

  return {
    ...snapshot,
    loading,
    refresh,
    saveDraft,
  };
}

export type LocalInventoryViewData = {
  inventories: Inventory[];
  items: InventoryItem[];
  totalValueCents: number;
};
