import { describe, expect, it } from "vitest";
import { defaultThemeId, getThemeDefinition, themeDefinitions } from "./theme";

describe("theme definitions", () => {
  it("offers all three approved themes", () => {
    expect(themeDefinitions.map((theme) => theme.id)).toEqual(["estate-ledger", "modern-utility", "collector-studio"]);
  });

  it("falls back to the default theme for unknown ids", () => {
    expect(getThemeDefinition("unknown").id).toBe(defaultThemeId);
  });
});
