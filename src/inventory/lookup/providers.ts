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
        categoryId: "books",
        photos: [openLibraryCoverUrl(code)],
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

    const data = (await response.json()) as {
      status?: number;
      product?: { product_name?: string; brands?: string; image_front_url?: string; image_url?: string };
    };
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
        photos: compactPhotos([data.product.image_front_url, data.product.image_url]),
        customFields: {
          maker: data.product.brands ?? null,
        },
      },
    };
  },
};

function openLibraryCoverUrl(code: string): string {
  return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(code)}-L.jpg?default=false`;
}

function compactPhotos(photos: Array<string | undefined>): string[] | undefined {
  const compacted = photos.filter((photo): photo is string => Boolean(photo));
  return compacted.length ? compacted : undefined;
}
