export interface FakeSqlite {
  items: Map<string, Record<string, unknown>>;
  queue: Record<string, unknown>[];
}

export function createFakeSqlite(): FakeSqlite {
  return {
    items: new Map(),
    queue: [],
  };
}
