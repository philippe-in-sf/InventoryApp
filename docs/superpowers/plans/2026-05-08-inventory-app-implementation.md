# Inventory App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first runnable Expo app foundation for a local-first home and collection inventory app with barcode lookup, manual entry, and optional Supabase-backed household sync.

**Architecture:** Use one Expo React Native codebase with Expo Router for iOS, Android, and web. Keep inventory behavior in a shared TypeScript domain layer, persist edits locally first through SQLite, and treat Supabase as an optional sync target for signed-in household collaboration.

**Tech Stack:** Expo React Native, Expo Router, TypeScript, expo-sqlite, expo-camera, Supabase JS, Vitest, React Native Testing Library, ESLint.

---

## Current Workspace Git Note

This workspace uses `.codex-git` for Git metadata because the sandbox blocks creating a normal `.git` directory. Run Git commands from the project root with this prefix:

```bash
git --git-dir=.codex-git --work-tree=.
```

## File Structure

- `app/_layout.tsx`: root Expo Router layout and providers.
- `app/(tabs)/_layout.tsx`: tab navigation.
- `app/(tabs)/index.tsx`: dashboard.
- `app/(tabs)/inventories.tsx`: inventory and collection browser.
- `app/(tabs)/add.tsx`: scan/manual add-item entry point.
- `app/(tabs)/household.tsx`: auth and household settings.
- `src/inventory/domain/types.ts`: stable inventory, item, category, barcode, and sync types.
- `src/inventory/domain/categoryTemplates.ts`: predefined book, electronics, home, and custom templates.
- `src/inventory/domain/validation.ts`: item draft validation and normalization.
- `src/inventory/local/schema.ts`: SQLite schema constants and migration list.
- `src/inventory/local/database.ts`: SQLite database opening and migration runner.
- `src/inventory/local/itemRepository.ts`: local item CRUD and sync queue writes.
- `src/inventory/local/inventoryRepository.ts`: local inventory, room, and collection CRUD.
- `src/inventory/lookup/types.ts`: barcode lookup interfaces.
- `src/inventory/lookup/providers.ts`: Open Library and Open Food Facts provider implementations.
- `src/inventory/lookup/lookupService.ts`: provider orchestration, confidence, and fallback behavior.
- `src/inventory/sync/supabaseClient.ts`: optional Supabase client construction.
- `src/inventory/sync/syncEngine.ts`: push/pull local changes for shared inventories.
- `src/inventory/sync/conflicts.ts`: item-level last-writer-wins merge behavior.
- `src/inventory/ui/components/*`: focused reusable UI components.
- `src/inventory/ui/screens/*`: screen implementations imported by Expo Router routes.
- `src/test/*`: test helpers and fixtures.
- `supabase/migrations/0001_inventory_schema.sql`: cloud schema for households, memberships, inventories, items, and photos.

## Task 1: Scaffold The Expo App And Test Harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `app/_layout.tsx`
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/index.tsx`
- Create: `src/test/smoke.test.ts`

- [ ] **Step 1: Scaffold the app**

Run:

```bash
npx create-expo-app@latest .tmp-expo --template default
rsync -a --exclude .git .tmp-expo/ ./
rm -rf .tmp-expo
npm install expo-router expo-sqlite expo-camera @supabase/supabase-js @react-native-async-storage/async-storage
npm install --save-dev vitest @testing-library/react-native @testing-library/jest-native eslint prettier
```

Expected: `package.json`, Expo app files, and dependency lockfile are created in the project root while existing `docs/` files remain in place.

- [ ] **Step 2: Replace `package.json` scripts**

Use this scripts block:

```json
{
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android",
    "web": "expo start --web",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint ."
  }
}
```

- [ ] **Step 3: Add TypeScript test config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
```

- [ ] **Step 4: Add root app layout**

Create `app/_layout.tsx`:

```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- [ ] **Step 5: Add tab layout**

Create `app/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarLabelPosition: "below-icon" }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="inventories" options={{ title: "Inventories" }} />
      <Tabs.Screen name="add" options={{ title: "Add" }} />
      <Tabs.Screen name="household" options={{ title: "Household" }} />
    </Tabs>
  );
}
```

- [ ] **Step 6: Add starter dashboard screen**

Create `app/(tabs)/index.tsx`:

```tsx
import { Text, View } from "react-native";

export default function DashboardRoute() {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Inventory</Text>
      <Text style={{ marginTop: 8, fontSize: 16 }}>
        Local-first home and collection inventory.
      </Text>
    </View>
  );
}
```

- [ ] **Step 7: Add smoke test**

Create `src/test/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("runs TypeScript tests", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 8: Run verification**

Run:

```bash
npm test
npm run lint
```

Expected: test suite passes; lint runs without syntax errors.

- [ ] **Step 9: Commit**

Run:

```bash
git --git-dir=.codex-git --work-tree=. add package.json package-lock.json tsconfig.json vitest.config.ts app src
git --git-dir=.codex-git --work-tree=. commit -m "chore: scaffold expo inventory app"
```

## Task 2: Define Inventory Domain Types And Category Templates

**Files:**
- Create: `src/inventory/domain/types.ts`
- Create: `src/inventory/domain/categoryTemplates.ts`
- Create: `src/inventory/domain/validation.ts`
- Create: `src/inventory/domain/validation.test.ts`

- [ ] **Step 1: Write validation tests first**

Create `src/inventory/domain/validation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { normalizeItemDraft, validateItemDraft } from "./validation";

describe("inventory item validation", () => {
  it("requires a name", () => {
    const result = validateItemDraft({ name: " ", categoryId: "book", quantity: 1 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Name is required.");
  });

  it("normalizes quantity and value", () => {
    const draft = normalizeItemDraft({
      name: "  Camera  ",
      categoryId: "electronics",
      quantity: 0,
      approximateValueCents: -25,
    });

    expect(draft.name).toBe("Camera");
    expect(draft.quantity).toBe(1);
    expect(draft.approximateValueCents).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/inventory/domain/validation.test.ts
```

Expected: FAIL because `validation.ts` does not exist.

- [ ] **Step 3: Add domain types**

Create `src/inventory/domain/types.ts`:

```ts
export type InventoryKind = "home" | "collection";
export type SyncScope = "local" | "shared";
export type BarcodeKind = "UPC" | "EAN" | "ISBN";

export type CustomFieldType = "text" | "number" | "currency" | "date" | "select";

export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[];
}

export interface CategoryTemplate {
  id: string;
  label: string;
  fields: CustomFieldDefinition[];
}

export interface Inventory {
  id: string;
  kind: InventoryKind;
  name: string;
  householdId?: string;
  syncScope: SyncScope;
  createdAt: string;
  updatedAt: string;
}

export interface ItemBarcode {
  kind: BarcodeKind;
  code: string;
}

export interface InventoryItem {
  id: string;
  inventoryId: string;
  name: string;
  categoryId: string;
  locationId?: string;
  quantity: number;
  photos: string[];
  barcodes: ItemBarcode[];
  description?: string;
  approximateValueCents: number;
  purchaseDate?: string;
  purchasePriceCents?: number;
  condition?: string;
  customFields: Record<string, string | number | boolean | null>;
  syncScope: SyncScope;
  syncState: "clean" | "dirty" | "syncing" | "error";
  createdAt: string;
  updatedAt: string;
  lastUpdatedBy?: string;
}

export interface ItemDraft {
  name: string;
  categoryId: string;
  quantity?: number;
  approximateValueCents?: number;
  customFields?: Record<string, string | number | boolean | null>;
}
```

- [ ] **Step 4: Add initial category templates**

Create `src/inventory/domain/categoryTemplates.ts`:

```ts
import type { CategoryTemplate } from "./types";

export const categoryTemplates: CategoryTemplate[] = [
  {
    id: "book",
    label: "Book",
    fields: [
      { id: "title", label: "Title", type: "text", required: true },
      { id: "author", label: "Author", type: "text", required: false },
      { id: "topic", label: "Topic or theme", type: "text", required: false },
      { id: "isbn", label: "ISBN", type: "text", required: false },
      { id: "publisher", label: "Publisher", type: "text", required: false },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    fields: [
      { id: "maker", label: "Maker", type: "text", required: false },
      { id: "deviceType", label: "Device type", type: "text", required: false },
      { id: "model", label: "Model", type: "text", required: false },
      { id: "serialNumber", label: "Serial number", type: "text", required: false },
      { id: "warrantyNotes", label: "Warranty or purchase notes", type: "text", required: false },
    ],
  },
  {
    id: "general",
    label: "General item",
    fields: [],
  },
];

export function findCategoryTemplate(categoryId: string): CategoryTemplate {
  return categoryTemplates.find((template) => template.id === categoryId) ?? categoryTemplates[2];
}
```

- [ ] **Step 5: Add validation implementation**

Create `src/inventory/domain/validation.ts`:

```ts
import type { ItemDraft } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function normalizeItemDraft(draft: ItemDraft): Required<ItemDraft> {
  return {
    name: draft.name.trim(),
    categoryId: draft.categoryId,
    quantity: Math.max(1, Math.floor(draft.quantity ?? 1)),
    approximateValueCents: Math.max(0, Math.floor(draft.approximateValueCents ?? 0)),
    customFields: draft.customFields ?? {},
  };
}

export function validateItemDraft(draft: ItemDraft): ValidationResult {
  const normalized = normalizeItemDraft(draft);
  const errors: string[] = [];

  if (normalized.name.length === 0) {
    errors.push("Name is required.");
  }

  if (normalized.categoryId.trim().length === 0) {
    errors.push("Category is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test -- src/inventory/domain/validation.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git --git-dir=.codex-git --work-tree=. add src/inventory/domain
git --git-dir=.codex-git --work-tree=. commit -m "feat: add inventory domain model"
```

## Task 3: Add Local SQLite Schema And Repositories

**Files:**
- Create: `src/inventory/local/schema.ts`
- Create: `src/inventory/local/database.ts`
- Create: `src/inventory/local/itemRepository.ts`
- Create: `src/inventory/local/itemRepository.test.ts`
- Create: `src/test/fakeSqlite.ts`

- [ ] **Step 1: Write repository behavior tests**

Create `src/inventory/local/itemRepository.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/inventory/local/itemRepository.test.ts
```

Expected: FAIL because local repository files do not exist.

- [ ] **Step 3: Add schema constants**

Create `src/inventory/local/schema.ts`:

```ts
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
```

- [ ] **Step 4: Add fake SQLite test adapter**

Create `src/test/fakeSqlite.ts`:

```ts
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
```

- [ ] **Step 5: Add repository implementation**

Create `src/inventory/local/itemRepository.ts`:

```ts
import type { InventoryItem, ItemDraft } from "../domain/types";
import type { FakeSqlite } from "../../test/fakeSqlite";

export interface ItemRepository {
  saveItem(input: ItemDraft & { id: string; inventoryId: string }): Promise<InventoryItem>;
  getItem(id: string): Promise<InventoryItem | undefined>;
}

export function createItemRepository(db: FakeSqlite): ItemRepository {
  return {
    async saveItem(input) {
      const now = new Date().toISOString();
      const item: InventoryItem = {
        id: input.id,
        inventoryId: input.inventoryId,
        name: input.name.trim(),
        categoryId: input.categoryId,
        quantity: Math.max(1, input.quantity ?? 1),
        photos: [],
        barcodes: [],
        approximateValueCents: Math.max(0, input.approximateValueCents ?? 0),
        customFields: input.customFields ?? {},
        syncScope: "local",
        syncState: "dirty",
        createdAt: now,
        updatedAt: now,
      };

      db.items.set(item.id, item);
      db.queue.push({
        id: `queue-${item.id}-${now}`,
        entityType: "item",
        entityId: item.id,
        operation: "upsert",
        createdAt: now,
      });

      return item;
    },
    async getItem(id) {
      return db.items.get(id) as InventoryItem | undefined;
    },
  };
}
```

- [ ] **Step 6: Add Expo SQLite database opener**

Create `src/inventory/local/database.ts`:

```ts
import * as SQLite from "expo-sqlite";
import { localMigrations } from "./schema";

export async function openInventoryDatabase() {
  const db = await SQLite.openDatabaseAsync("inventory.db");

  for (const statement of localMigrations) {
    await db.execAsync(statement);
  }

  return db;
}
```

- [ ] **Step 7: Run tests**

Run:

```bash
npm test -- src/inventory/local/itemRepository.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

Run:

```bash
git --git-dir=.codex-git --work-tree=. add src/inventory/local src/test/fakeSqlite.ts
git --git-dir=.codex-git --work-tree=. commit -m "feat: add local inventory persistence"
```

## Task 4: Add Barcode Lookup Service

**Files:**
- Create: `src/inventory/lookup/types.ts`
- Create: `src/inventory/lookup/providers.ts`
- Create: `src/inventory/lookup/lookupService.ts`
- Create: `src/inventory/lookup/lookupService.test.ts`

- [ ] **Step 1: Write lookup tests**

Create `src/inventory/lookup/lookupService.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { LookupProvider } from "./types";
import { createLookupService } from "./lookupService";

describe("lookup service", () => {
  it("returns the first confident match", async () => {
    const weakProvider: LookupProvider = {
      name: "weak",
      lookup: async () => ({ status: "not_found" }),
    };
    const strongProvider: LookupProvider = {
      name: "strong",
      lookup: async () => ({
        status: "found",
        confidence: "high",
        fields: { name: "The Left Hand of Darkness", categoryId: "book" },
      }),
    };

    const service = createLookupService([weakProvider, strongProvider]);
    const result = await service.lookup("9780441478125");

    expect(result.status).toBe("found");
    expect(result.fields.name).toBe("The Left Hand of Darkness");
  });

  it("keeps the scanned code when all providers fail", async () => {
    const service = createLookupService([
      { name: "offline", lookup: async () => ({ status: "error", message: "Network unavailable" }) },
    ]);

    const result = await service.lookup("012345678905");
    expect(result.status).toBe("not_found");
    expect(result.scannedCode).toBe("012345678905");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/inventory/lookup/lookupService.test.ts
```

Expected: FAIL because lookup files do not exist.

- [ ] **Step 3: Add lookup types**

Create `src/inventory/lookup/types.ts`:

```ts
export type LookupConfidence = "low" | "medium" | "high";

export interface LookupFields {
  name: string;
  categoryId: string;
  description?: string;
  approximateValueCents?: number;
  customFields?: Record<string, string | number | boolean | null>;
}

export type LookupResult =
  | { status: "found"; confidence: LookupConfidence; fields: LookupFields; source?: string; scannedCode?: string }
  | { status: "not_found"; scannedCode?: string }
  | { status: "error"; message: string; scannedCode?: string };

export interface LookupProvider {
  name: string;
  lookup(code: string): Promise<LookupResult>;
}
```

- [ ] **Step 4: Add provider implementations**

Create `src/inventory/lookup/providers.ts`:

```ts
import type { LookupProvider, LookupResult } from "./types";

export const openLibraryProvider: LookupProvider = {
  name: "Open Library",
  async lookup(code: string): Promise<LookupResult> {
    const response = await fetch(`https://openlibrary.org/isbn/${encodeURIComponent(code)}.json`);
    if (response.status === 404) {
      return { status: "not_found", scannedCode: code };
    }
    if (!response.ok) {
      return { status: "error", message: `Open Library returned ${response.status}`, scannedCode: code };
    }

    const data = (await response.json()) as { title?: string; publishers?: string[] };
    if (!data.title) {
      return { status: "not_found", scannedCode: code };
    }

    return {
      status: "found",
      confidence: "high",
      source: "Open Library",
      scannedCode: code,
      fields: {
        name: data.title,
        categoryId: "book",
        customFields: {
          title: data.title,
          isbn: code,
          publisher: data.publishers?.[0] ?? null,
        },
      },
    };
  },
};

export const openFoodFactsProvider: LookupProvider = {
  name: "Open Food Facts",
  async lookup(code: string): Promise<LookupResult> {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`);
    if (!response.ok) {
      return { status: "error", message: `Open Food Facts returned ${response.status}`, scannedCode: code };
    }

    const data = (await response.json()) as { status?: number; product?: { product_name?: string; brands?: string } };
    if (data.status !== 1 || !data.product?.product_name) {
      return { status: "not_found", scannedCode: code };
    }

    return {
      status: "found",
      confidence: "medium",
      source: "Open Food Facts",
      scannedCode: code,
      fields: {
        name: data.product.product_name,
        categoryId: "general",
        customFields: {
          maker: data.product.brands ?? null,
        },
      },
    };
  },
};
```

- [ ] **Step 5: Add lookup orchestration**

Create `src/inventory/lookup/lookupService.ts`:

```ts
import type { LookupProvider, LookupResult } from "./types";

export interface LookupService {
  lookup(code: string): Promise<Extract<LookupResult, { status: "found" | "not_found" }>>;
}

export function createLookupService(providers: LookupProvider[]): LookupService {
  return {
    async lookup(code) {
      const normalizedCode = code.trim();

      for (const provider of providers) {
        const result = await provider.lookup(normalizedCode);
        if (result.status === "found") {
          return { ...result, scannedCode: normalizedCode };
        }
      }

      return { status: "not_found", scannedCode: normalizedCode };
    },
  };
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test -- src/inventory/lookup/lookupService.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git --git-dir=.codex-git --work-tree=. add src/inventory/lookup
git --git-dir=.codex-git --work-tree=. commit -m "feat: add barcode lookup service"
```

## Task 5: Add Supabase Cloud Schema And Sync Merge Rules

**Files:**
- Create: `supabase/migrations/0001_inventory_schema.sql`
- Create: `src/inventory/sync/conflicts.ts`
- Create: `src/inventory/sync/conflicts.test.ts`
- Create: `src/inventory/sync/supabaseClient.ts`

- [ ] **Step 1: Write conflict tests**

Create `src/inventory/sync/conflicts.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/inventory/sync/conflicts.test.ts
```

Expected: FAIL because `conflicts.ts` does not exist.

- [ ] **Step 3: Add conflict merge implementation**

Create `src/inventory/sync/conflicts.ts`:

```ts
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
```

- [ ] **Step 4: Add Supabase schema**

Create `supabase/migrations/0001_inventory_schema.sql`:

```sql
create table households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table household_members (
  household_id uuid not null references households(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner', 'editor')),
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table inventories (
  id uuid primary key,
  household_id uuid references households(id) on delete cascade,
  kind text not null check (kind in ('home', 'collection')),
  name text not null,
  sync_scope text not null check (sync_scope in ('local', 'shared')),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  last_updated_by uuid
);

create table items (
  id uuid primary key,
  inventory_id uuid not null references inventories(id) on delete cascade,
  name text not null,
  category_id text not null,
  location_id text,
  quantity integer not null default 1,
  photos_json jsonb not null default '[]'::jsonb,
  barcodes_json jsonb not null default '[]'::jsonb,
  description text,
  approximate_value_cents integer not null default 0,
  purchase_date date,
  purchase_price_cents integer,
  condition text,
  custom_fields_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  last_updated_by uuid
);
```

- [ ] **Step 5: Add Supabase client**

Create `src/inventory/sync/supabaseClient.ts`:

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export function createInventorySupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return undefined;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test -- src/inventory/sync/conflicts.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git --git-dir=.codex-git --work-tree=. add supabase src/inventory/sync
git --git-dir=.codex-git --work-tree=. commit -m "feat: add household sync foundation"
```

## Task 6: Build Add-Item Form And Scanner Fallback

**Files:**
- Create: `src/inventory/ui/screens/AddItemScreen.tsx`
- Create: `src/inventory/ui/components/ItemField.tsx`
- Modify: `app/(tabs)/add.tsx`
- Create: `src/inventory/ui/screens/AddItemScreen.test.tsx`

- [ ] **Step 1: Write UI tests**

Create `src/inventory/ui/screens/AddItemScreen.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";
import { AddItemScreen } from "./AddItemScreen";

describe("AddItemScreen", () => {
  it("saves a manual item", () => {
    const onSave = vi.fn();
    render(<AddItemScreen onSave={onSave} lookup={async () => ({ status: "not_found" })} />);

    fireEvent.changeText(screen.getByLabelText("Name"), "Desk lamp");
    fireEvent.press(screen.getByText("Save item"));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: "Desk lamp" }));
  });

  it("keeps scanned code when lookup fails", async () => {
    render(<AddItemScreen onSave={vi.fn()} lookup={async () => ({ status: "not_found", scannedCode: "012345678905" })} />);

    fireEvent.changeText(screen.getByLabelText("Barcode"), "012345678905");
    fireEvent.press(screen.getByText("Look up"));

    expect(await screen.findByText("No match found. The code is saved for manual entry.")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/inventory/ui/screens/AddItemScreen.test.tsx
```

Expected: FAIL because `AddItemScreen.tsx` does not exist.

- [ ] **Step 3: Add field component**

Create `src/inventory/ui/components/ItemField.tsx`:

```tsx
import { Text, TextInput, View } from "react-native";

interface ItemFieldProps {
  label: string;
  value: string;
  onChangeText(value: string): void;
}

export function ItemField({ label, value, onChangeText }: ItemFieldProps) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: "600" }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        style={{ borderWidth: 1, borderColor: "#bbb", borderRadius: 8, padding: 12 }}
      />
    </View>
  );
}
```

- [ ] **Step 4: Add add-item screen**

Create `src/inventory/ui/screens/AddItemScreen.tsx`:

```tsx
import { useState } from "react";
import { Button, Text, View } from "react-native";
import type { ItemDraft } from "../../domain/types";
import type { LookupService } from "../../lookup/lookupService";
import { ItemField } from "../components/ItemField";

interface AddItemScreenProps {
  onSave(draft: ItemDraft & { barcode?: string }): void;
  lookup: LookupService["lookup"];
}

export function AddItemScreen({ onSave, lookup }: AddItemScreenProps) {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [message, setMessage] = useState("");

  async function handleLookup() {
    const result = await lookup(barcode);
    if (result.status === "found") {
      setName(result.fields.name);
      setMessage(`Matched from ${result.source ?? "lookup provider"}. Review before saving.`);
      return;
    }

    setMessage("No match found. The code is saved for manual entry.");
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Add item</Text>
      <ItemField label="Barcode" value={barcode} onChangeText={setBarcode} />
      <Button title="Look up" onPress={handleLookup} />
      <ItemField label="Name" value={name} onChangeText={setName} />
      {message ? <Text>{message}</Text> : null}
      <Button title="Save item" onPress={() => onSave({ name, categoryId: "general", barcode })} />
    </View>
  );
}
```

- [ ] **Step 5: Wire route**

Create or replace `app/(tabs)/add.tsx`:

```tsx
import { Alert } from "react-native";
import { createLookupService } from "../../src/inventory/lookup/lookupService";
import { openFoodFactsProvider, openLibraryProvider } from "../../src/inventory/lookup/providers";
import { AddItemScreen } from "../../src/inventory/ui/screens/AddItemScreen";

const lookupService = createLookupService([openLibraryProvider, openFoodFactsProvider]);

export default function AddRoute() {
  return (
    <AddItemScreen
      lookup={lookupService.lookup}
      onSave={(draft) => {
        Alert.alert("Saved locally", `${draft.name || "Unnamed item"} is ready to save to the local database.`);
      }}
    />
  );
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test -- src/inventory/ui/screens/AddItemScreen.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git --git-dir=.codex-git --work-tree=. add 'app/(tabs)/add.tsx' src/inventory/ui
git --git-dir=.codex-git --work-tree=. commit -m "feat: add manual item capture flow"
```

## Task 7: Add Inventory Repository And Sync Engine

**Files:**
- Create: `src/inventory/local/inventoryRepository.ts`
- Create: `src/inventory/local/inventoryRepository.test.ts`
- Create: `src/inventory/sync/syncEngine.ts`
- Create: `src/inventory/sync/syncEngine.test.ts`

- [ ] **Step 1: Write inventory repository tests**

Create `src/inventory/local/inventoryRepository.test.ts`:

```ts
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
```

- [ ] **Step 2: Run inventory repository test to verify it fails**

Run:

```bash
npm test -- src/inventory/local/inventoryRepository.test.ts
```

Expected: FAIL because `inventoryRepository.ts` does not exist.

- [ ] **Step 3: Add inventory repository implementation**

Create `src/inventory/local/inventoryRepository.ts`:

```ts
import type { Inventory, InventoryKind } from "../domain/types";

interface CreateInventoryInput {
  id: string;
  kind: InventoryKind;
  name: string;
  householdId?: string;
}

export function createInventoryRepository() {
  const inventories = new Map<string, Inventory>();

  return {
    async createInventory(input: CreateInventoryInput): Promise<Inventory> {
      const now = new Date().toISOString();
      const inventory: Inventory = {
        id: input.id,
        kind: input.kind,
        name: input.name.trim(),
        householdId: input.householdId,
        syncScope: input.householdId ? "shared" : "local",
        createdAt: now,
        updatedAt: now,
      };

      inventories.set(inventory.id, inventory);
      return inventory;
    },
    async listInventories(): Promise<Inventory[]> {
      return Array.from(inventories.values()).sort((a, b) => a.name.localeCompare(b.name));
    },
  };
}
```

- [ ] **Step 4: Write sync engine tests**

Create `src/inventory/sync/syncEngine.test.ts`:

```ts
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
```

- [ ] **Step 5: Run sync test to verify it fails**

Run:

```bash
npm test -- src/inventory/sync/syncEngine.test.ts
```

Expected: FAIL because `syncEngine.ts` does not exist.

- [ ] **Step 6: Add sync engine implementation**

Create `src/inventory/sync/syncEngine.ts`:

```ts
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
```

- [ ] **Step 7: Run tests**

Run:

```bash
npm test -- src/inventory/local/inventoryRepository.test.ts src/inventory/sync/syncEngine.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

Run:

```bash
git --git-dir=.codex-git --work-tree=. add src/inventory/local/inventoryRepository.ts src/inventory/local/inventoryRepository.test.ts src/inventory/sync/syncEngine.ts src/inventory/sync/syncEngine.test.ts
git --git-dir=.codex-git --work-tree=. commit -m "feat: add inventory repository and sync engine"
```

## Task 8: Build Dashboard, Inventory Browser, And Household Screens

**Files:**
- Create: `src/inventory/ui/screens/DashboardScreen.tsx`
- Create: `src/inventory/ui/screens/InventoriesScreen.tsx`
- Create: `src/inventory/ui/screens/HouseholdScreen.tsx`
- Modify: `app/(tabs)/index.tsx`
- Create: `app/(tabs)/inventories.tsx`
- Create: `app/(tabs)/household.tsx`

- [ ] **Step 1: Add dashboard screen**

Create `src/inventory/ui/screens/DashboardScreen.tsx`:

```tsx
import { Text, View } from "react-native";

export function DashboardScreen() {
  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Inventory</Text>
      <Text>Recent inventories</Text>
      <Text>Sync status: local-first, cloud sync optional</Text>
      <Text>Quick add is available from the Add tab.</Text>
    </View>
  );
}
```

- [ ] **Step 2: Add inventories screen**

Create `src/inventory/ui/screens/InventoriesScreen.tsx`:

```tsx
import { Text, View } from "react-native";

export function InventoriesScreen() {
  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Inventories</Text>
      <Text>Home inventory: organize by property, room, or area.</Text>
      <Text>Collections: books, electronics, tools, collectibles, art, media, or custom.</Text>
      <Text>Search, filters, item counts, and estimated values will read from the local database.</Text>
    </View>
  );
}
```

- [ ] **Step 3: Add household screen**

Create `src/inventory/ui/screens/HouseholdScreen.tsx`:

```tsx
import { Text, View } from "react-native";
import { createInventorySupabaseClient } from "../../sync/supabaseClient";

export function HouseholdScreen() {
  const supabaseEnabled = Boolean(createInventorySupabaseClient());

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Household</Text>
      <Text>{supabaseEnabled ? "Cloud sync is configured." : "Cloud sync is not configured on this device."}</Text>
      <Text>Shared inventories can be enabled after sign-in.</Text>
      <Text>Local-only inventories remain private.</Text>
    </View>
  );
}
```

- [ ] **Step 4: Wire routes**

Replace `app/(tabs)/index.tsx`:

```tsx
import { DashboardScreen } from "../../src/inventory/ui/screens/DashboardScreen";

export default function DashboardRoute() {
  return <DashboardScreen />;
}
```

Create `app/(tabs)/inventories.tsx`:

```tsx
import { InventoriesScreen } from "../../src/inventory/ui/screens/InventoriesScreen";

export default function InventoriesRoute() {
  return <InventoriesScreen />;
}
```

Create `app/(tabs)/household.tsx`:

```tsx
import { HouseholdScreen } from "../../src/inventory/ui/screens/HouseholdScreen";

export default function HouseholdRoute() {
  return <HouseholdScreen />;
}
```

- [ ] **Step 5: Run app verification**

Run:

```bash
npm test
npm run web
```

Expected: tests pass and web app opens with Dashboard, Inventories, Add, and Household tabs.

- [ ] **Step 6: Commit**

Run:

```bash
git --git-dir=.codex-git --work-tree=. add app src/inventory/ui
git --git-dir=.codex-git --work-tree=. commit -m "feat: add core inventory screens"
```

## Task 9: Verify Against The Spec

**Files:**
- Modify: `docs/superpowers/specs/2026-05-08-inventory-app-design.md` only if implementation discoveries require clarifying the approved design.
- Modify: `docs/superpowers/plans/2026-05-08-inventory-app-implementation.md` only if task wording must be corrected after execution.

- [ ] **Step 1: Run full checks**

Run:

```bash
npm test
npm run lint
npm run web
```

Expected: tests and lint pass; the app runs on web.

- [ ] **Step 2: Mobile camera sanity check**

Run:

```bash
npm run ios
```

Expected: app launches in the iOS simulator. The Add tab is reachable. If camera permission is unavailable in simulator, manual barcode entry remains usable.

- [ ] **Step 3: Spec coverage check**

Confirm these implementation points exist:

- Expo app runs for web and mobile.
- Local-first domain and SQLite schema are present.
- Home and collection inventory concepts are represented.
- Books and electronics templates exist.
- Barcode lookup service has ISBN and broad EAN/UPC provider support.
- Manual entry works when lookup fails.
- Supabase schema and client are present for optional household sync.
- Last-writer-wins conflict behavior is tested.

- [ ] **Step 4: Commit final verification notes if files changed**

Run only if files changed:

```bash
git --git-dir=.codex-git --work-tree=. add docs src app supabase
git --git-dir=.codex-git --work-tree=. commit -m "docs: align implementation with approved spec"
```
