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
