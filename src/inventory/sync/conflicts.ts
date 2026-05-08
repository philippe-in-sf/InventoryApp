import type { InventoryItem } from "../domain/types";

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function mergeItemLastWriterWins(local: InventoryItem, remote: InventoryItem): InventoryItem {
  const localTime = Date.parse(local.updatedAt);
  const remoteTime = Date.parse(remote.updatedAt);
  const winner = remoteTime > localTime ? remote : local;

  return {
    ...winner,
    photos: unique([...local.photos, ...remote.photos]),
    syncState: "clean",
  };
}
