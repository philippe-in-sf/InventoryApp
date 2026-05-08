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
