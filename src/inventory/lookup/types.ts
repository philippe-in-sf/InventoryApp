export type LookupConfidence = "low" | "medium" | "high";

export interface LookupFields {
  name: string;
  categoryId: string;
  description?: string;
  approximateValueCents?: number;
  photos?: string[];
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
