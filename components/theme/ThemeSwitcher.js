"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

const LABELS = {
  pastel: "Pastel",
  sunset: "Sunset",
  mint: "Mint",
  lavender: "Lavender",
  midnight: "Midnight",
};

export function ThemeSwitcher({ className = "" }) {
  const { theme, setTheme, themes } = useTheme();
  return (
    <label className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className="text-slate-600">Theme</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="rounded-xl border border-[hsl(var(--border))] bg-white/70 px-2 py-1 text-xs outline-none"
      >
        {themes.map((t) => (
          <option key={t} value={t}>{LABELS[t] || t}</option>
        ))}
      </select>
    </label>
  );
}
