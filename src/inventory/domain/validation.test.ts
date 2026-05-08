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
