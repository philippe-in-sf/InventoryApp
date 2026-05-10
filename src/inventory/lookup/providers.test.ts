import { afterEach, describe, expect, it, vi } from "vitest";
import { openFoodFactsProvider, openLibraryProvider } from "./providers";

describe("lookup providers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("adds an Open Library cover URL for ISBN matches", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ title: "Dune", publishers: ["Ace"] }))));

    const result = await openLibraryProvider.lookup("9780441172719");

    expect(result.status).toBe("found");
    if (result.status === "found") {
      expect(result.fields.photos).toEqual(["https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg?default=false"]);
    }
  });

  it("uses Open Food Facts product imagery when available", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            status: 1,
            product: {
              product_name: "Aged balsamic vinegar",
              brands: "Acme Pantry",
              image_front_url: "https://images.openfoodfacts.org/front.jpg",
            },
          }),
        ),
      ),
    );

    const result = await openFoodFactsProvider.lookup("012345678905");

    expect(result.status).toBe("found");
    if (result.status === "found") {
      expect(result.fields.photos).toEqual(["https://images.openfoodfacts.org/front.jpg"]);
    }
  });
});
