import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { defaultThemeId, getThemeDefinition, type ThemeDefinition, type ThemeId } from "./theme";

const STORAGE_KEY = "inventory-app.theme.v1";

interface ThemeContextValue {
  theme: ThemeDefinition;
  themeId: ThemeId;
  setThemeId(themeId: ThemeId): void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [themeId, setThemeIdState] = useState<ThemeId>(defaultThemeId);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!mounted || !stored) return;
      setThemeIdState(getThemeDefinition(stored).id);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme: getThemeDefinition(themeId),
      themeId,
      setThemeId(nextThemeId) {
        setThemeIdState(nextThemeId);
        void AsyncStorage.setItem(STORAGE_KEY, nextThemeId);
      },
    };
  }, [themeId]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
