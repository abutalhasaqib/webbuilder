"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "wb:theme";
export const THEMES = ["pastel", "sunset", "mint", "lavender", "midnight"];

const ThemeContext = createContext({ theme: "pastel", setTheme: () => {}, themes: THEMES });

export function ThemeProvider({ initial = "pastel", children }) {
  const [theme, setTheme] = useState(initial);

  // load persisted theme
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && THEMES.includes(saved)) setTheme(saved);
    } catch {}
  }, []);

  // apply and persist
  useEffect(() => {
    const root = document.documentElement; // <html>
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, themes: THEMES }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
