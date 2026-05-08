export const localMigrations = [
  `CREATE TABLE IF NOT EXISTS inventories (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    household_id TEXT,
    sync_scope TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    inventory_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category_id TEXT NOT NULL,
    location_id TEXT,
    quantity INTEGER NOT NULL,
    photos_json TEXT NOT NULL,
    barcodes_json TEXT NOT NULL,
    description TEXT,
    approximate_value_cents INTEGER NOT NULL,
    purchase_date TEXT,
    purchase_price_cents INTEGER,
    condition TEXT,
    custom_fields_json TEXT NOT NULL,
    sync_scope TEXT NOT NULL,
    sync_state TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_updated_by TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    operation TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
];
