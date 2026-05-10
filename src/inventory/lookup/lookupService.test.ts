import { describe, expect, it } from "vitest";
import { createLookupService } from "./lookupService";
import type { LookupProvider } from "./types";

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
    if (result.status !== "found") throw new Error("Expected a lookup match");
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
