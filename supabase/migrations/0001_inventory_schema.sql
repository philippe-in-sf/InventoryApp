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
