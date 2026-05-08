# Inventory App Design

## Summary

Build a cross-platform inventory app for iOS, Android, and web. The app supports both whole-home inventories and collections of things from day one. It is local-first by default, stores data on the device, and optionally syncs selected inventories to a shared cloud database for household collaboration.

The first version prioritizes practical item capture, flexible category-specific fields, broad barcode lookup, manual correction, and reliable offline behavior.

## Goals

- Support iOS, Android, and web from one shared app codebase.
- Let users create whole-home inventories organized by property, room, or area.
- Let users create collections such as books, electronics, tools, collectibles, art, media, or custom collection types.
- Store inventory data locally by default so the app remains useful offline and without an account.
- Add optional sign-in and household collaboration in the first version.
- Use mobile camera scanning for UPC, EAN, and ISBN codes where possible.
- Prefill item data from lookup results while allowing the user to edit every imported field.
- Support manual entry for all item types and all platforms.
- Preserve user-entered work when lookup, camera, network, or sync operations fail.

## Non-Goals For The First Version

- Field-level collaborative editing or conflict review.
- Marketplace-grade valuation or automated appraisal.
- Insurance-provider integrations.
- Public share links, PDF reports, CSV exports, or read-only external sharing.
- Native-only platform-specific implementations.

## Recommended Architecture

Use Expo React Native with web support and a shared TypeScript codebase.

The app is divided into these primary units:

- Inventory domain: homes, properties, rooms, collections, items, categories, templates, and custom fields.
- Capture flows: barcode scan, photo capture, manual item entry, and category-specific forms.
- Lookup service: UPC, EAN, and ISBN lookup with match confidence and user correction.
- Local database: SQLite tables, migrations, and local query helpers.
- Cloud sync: authenticated household workspaces, shared inventories, member metadata, and conflict metadata.
- Reports and search: inventory browsing, filters, item counts, and estimated value summaries.

The cloud layer is optional infrastructure. Local SQLite is the default working store, and cloud sync mirrors selected inventories when the user signs in and enables sharing.

## Data Model

The product model supports home inventories and collections through a shared item system.

Core entities:

- User: an authenticated account when cloud sync is enabled.
- Household: a shared workspace for collaborative inventories.
- Property: a home or physical property inside a household.
- Room or area: a location within a property.
- Collection: a named group of items, optionally personal or household-shared.
- Item: a tracked object with common fields and category-specific fields.
- Category template: a predefined or custom schema for item-specific fields.
- Item photo: local and synced image metadata.
- Barcode: UPC, EAN, ISBN, or manually entered code attached to an item.
- Sync record: local version, cloud version, timestamps, dirty state, and last editor.

Common item fields:

- Name
- Category
- Location
- Quantity
- Photos
- Barcode, UPC, EAN, or ISBN when available
- Description or notes
- Approximate value
- Purchase date
- Purchase price
- Condition
- Created and updated timestamps
- Last updated by
- Local/shared sync status

Book template fields:

- Title
- Author
- Topic or theme
- ISBN
- Publisher when available
- Approximate value
- Notes

Electronics template fields:

- Maker
- Device type
- Model
- Serial number
- Approximate value
- Condition
- Purchase date
- Warranty or purchase notes

Users can add custom fields to any item or category template because collections vary widely.

## Core User Flows

### Create Inventory

Users can create a home inventory, a collection, or both.

A home inventory can be organized by property, room, or area. A collection can use a predefined category template or a custom template.

### Add Item

Users can add an item by scanning a barcode or entering details manually.

On mobile, barcode scanning uses the camera for UPC, EAN, and ISBN codes. On web, manual entry is always available. Webcam scanning can be added only if browser support is reliable enough.

### Review Lookup Result

When a lookup returns a match, the app opens the item form with prefilled fields and a visible match status or confidence level. The user can edit every imported field before saving.

If lookup fails, returns weak data, or the network is unavailable, the app keeps the scanned code and continues into manual entry.

### Share Household

A signed-in user can create or join a household and invite members. Shared inventories sync through the cloud database. Local-only inventories remain private unless the user explicitly enables sharing.

## Sync Behavior

The app saves all edits to local SQLite first. When the user is signed in and an inventory is shared, the app queues local changes for upload and pulls remote changes into the local database.

First-version conflict behavior:

- Ordinary item fields use item-level last-writer-wins.
- Each changed item records updated timestamp and last editor.
- Photo and attachment changes should be additive where possible.
- Failed sync attempts keep local changes and retry later.
- Users can continue editing while offline.

This deliberately avoids field-level merge complexity in the first version while preserving enough metadata to improve conflict handling later.

## Error Handling

User work must be preserved above all else.

- Camera unavailable or permission denied: fall back to manual barcode entry.
- Barcode scan succeeds but lookup fails: keep the scanned code and open manual entry.
- Lookup result is incomplete or low confidence: prefill only what is available and make all fields editable.
- Local save fails: show a blocking error and keep the form data in memory until the user can retry.
- Cloud sync fails: keep the item saved locally, show sync status, and retry later.
- Sign-in expires: keep local inventory usable and pause cloud sync until the user signs in again.

## Main Screens

- Dashboard: recent inventories, household status, quick add, and sync status.
- Inventory view: room, area, or collection navigation, search, filters, item counts, and total estimated value.
- Item detail: photos, core fields, category fields, value notes, and sync status.
- Add/edit item form: scan-first path on mobile, manual fields always available, grouped category-specific fields.
- Household settings: members, invites, shared inventories, and local-only inventories.

The app should feel like a practical working inventory tool, not a passive catalog browser.

## Testing Strategy

Initial test coverage should focus on the highest-risk boundaries:

- Local database migrations and schema constraints.
- Category template validation and custom field persistence.
- Barcode lookup parsing and confidence handling.
- Offline item creation and editing.
- Sync queue behavior and retry logic.
- Last-writer-wins conflict behavior.
- Add-item flow for scan success, lookup failure, and manual entry fallback.
- Shared inventory sync status in the UI.

## Open Product Decisions

These are intentionally deferred until implementation planning:

- Exact cloud backend choice.
- Authentication provider.
- First set of category templates beyond books and electronics.
- Lookup provider selection and fallback order.
- Whether webcam scanning is included in the first web release.
