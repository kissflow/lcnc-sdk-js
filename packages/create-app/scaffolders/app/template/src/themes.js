// Theme-preset registry. Each entry maps to a [data-theme="id"] block in
// themes.css (a re-tint of the neutral base — accent + chart ramp). The agent
// picks a default per app; the shell's switcher lets you try combinations live.
//
// To set the app default: change DEFAULT_THEME below (and the `data-theme` on
// <html> in index.html so there's no first-paint flash).
export const THEMES = [
  { id: "violet", label: "Violet", swatch: "oklch(0.541 0.281 293.009)" },
  { id: "blue", label: "Blue", swatch: "oklch(0.546 0.245 262.881)" },
  { id: "emerald", label: "Emerald", swatch: "oklch(0.596 0.145 163.225)" },
  { id: "rose", label: "Rose", swatch: "oklch(0.586 0.253 17.585)" },
  { id: "amber", label: "Amber", swatch: "oklch(0.769 0.188 70.08)" },
  { id: "orange", label: "Orange", swatch: "oklch(0.646 0.222 41.116)" },
  { id: "neutral", label: "Neutral", swatch: "oklch(0.205 0 0)" }
];

export const DEFAULT_THEME = "violet";

const KEY = "kf-theme";

export function getTheme() {
  return localStorage.getItem(KEY) || DEFAULT_THEME;
}

/** Apply a preset by id. "neutral" clears the attribute (the index.css base). */
export function applyTheme(id) {
  const root = document.documentElement;
  if (id === "neutral") root.removeAttribute("data-theme");
  else root.dataset.theme = id;
  localStorage.setItem(KEY, id);
  return id;
}
