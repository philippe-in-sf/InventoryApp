export type ThemeId = "estate-ledger" | "modern-utility" | "collector-studio";

export interface ThemePalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  primary: string;
  primaryDark: string;
  accent: string;
  accentSoft: string;
  greenSoft: string;
  blueSoft: string;
  goldSoft: string;
  danger: string;
  heroText: string;
  heroMuted: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  palette: ThemePalette;
}

export const themeDefinitions: ThemeDefinition[] = [
  {
    id: "estate-ledger",
    name: "Estate Ledger",
    description: "Quiet, premium, insurance-ready.",
    palette: {
      background: "#f6f3ee",
      surface: "#fffdf9",
      surfaceAlt: "#ece7df",
      ink: "#1f2623",
      muted: "#68736d",
      faint: "#8f9791",
      line: "#ded7cc",
      primary: "#215c58",
      primaryDark: "#173f3c",
      accent: "#c8774a",
      accentSoft: "#f3dfd1",
      greenSoft: "#dce9df",
      blueSoft: "#dce5ec",
      goldSoft: "#f2e4bf",
      danger: "#9f3d32",
      heroText: "#fffdf9",
      heroMuted: "#d8e2df",
    },
  },
  {
    id: "modern-utility",
    name: "Modern Utility",
    description: "Fast, crisp, app-store polished.",
    palette: {
      background: "#f7f9fb",
      surface: "#ffffff",
      surfaceAlt: "#eef4f8",
      ink: "#111827",
      muted: "#64748b",
      faint: "#94a3b8",
      line: "#e2e8f0",
      primary: "#2563eb",
      primaryDark: "#1e3a8a",
      accent: "#14b8a6",
      accentSoft: "#ccfbf1",
      greenSoft: "#ecfdf5",
      blueSoft: "#dbeafe",
      goldSoft: "#fef3c7",
      danger: "#dc2626",
      heroText: "#ffffff",
      heroMuted: "#dbeafe",
    },
  },
  {
    id: "collector-studio",
    name: "Collector Studio",
    description: "Personal, visual, collection-oriented.",
    palette: {
      background: "#f4efe7",
      surface: "#ffffff",
      surfaceAlt: "#eee7ff",
      ink: "#241f1c",
      muted: "#6f625a",
      faint: "#9b8c81",
      line: "#e1d6c9",
      primary: "#8a5cf6",
      primaryDark: "#3b2f2a",
      accent: "#d6a85a",
      accentSoft: "#f4e6c8",
      greenSoft: "#f4efe7",
      blueSoft: "#eee7ff",
      goldSoft: "#f2dfb0",
      danger: "#a6463b",
      heroText: "#fff7ed",
      heroMuted: "#e8dccf",
    },
  },
];

export const defaultThemeId: ThemeId = "estate-ledger";

export function getThemeDefinition(id: string | null | undefined): ThemeDefinition {
  return themeDefinitions.find((theme) => theme.id === id) ?? themeDefinitions[0];
}

export const palette = getThemeDefinition(defaultThemeId).palette;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
};

export const type = {
  label: 12,
  body: 15,
  title: 22,
  hero: 34,
};
