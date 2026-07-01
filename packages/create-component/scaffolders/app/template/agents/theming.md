# Theming — shadcn + Tailwind v4

Styles are managed the shadcn way: a small set of **CSS variables in `oklch`**, wired
to Tailwind v4 via `@theme inline`. You **never hardcode colors** — you use semantic
utilities (`bg-card`, `text-muted-foreground`, `text-primary`, `border-border`,
`bg-sidebar`, the `--chart-*` vars). That's what lets you swap the whole look by
changing one block.

## The model

- **Base** (neutral grayscale: `background`, `card`, `muted`, `border`, `foreground`…)
  lives in `src/index.css` — `:root` (light) + `.dark` (dark).
- **Accent presets** (the re-tint: `primary`, `ring`, `sidebar-primary`, `chart-1..5`)
  live in `src/themes.css` as `[data-theme="<id>"]` blocks. Registry in `src/themes.js`.
- Built-in presets: **violet** (default), **blue**, **emerald**, **rose**, **amber**,
  **orange**, and **neutral** (no accent — the bare base).

## Picking a theme for an app

Choose the accent that fits the domain, then set it as the default in **two** places:

1. `src/themes.js` → `DEFAULT_THEME = "blue"`
2. `index.html` → `<html data-theme="blue">` (prevents a first-paint flash)

That's it — every page re-tints because everything is token-driven. The sidebar
**Theme** switcher lets you try presets live while designing (it writes
`localStorage`, so your pick sticks).

## Adding a new preset

Copy a block in `src/themes.css`, give it an id, pick one oklch **hue** (0–360), and
keep the chart ramp formula (same hue, rising lightness / falling chroma). Add a matching
`.dark` block (lighter primary) and a `{ id, label, swatch }` entry in `src/themes.js`.

```css
[data-theme="teal"] {
  --primary: oklch(0.6 0.12 192);
  --primary-foreground: oklch(0.985 0 0);
  --ring: var(--primary);
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-ring: var(--primary);
  --chart-1: oklch(0.55 0.11 192); --chart-2: oklch(0.62 0.11 192);
  --chart-3: oklch(0.69 0.1 192);  --chart-4: oklch(0.76 0.08 192);
  --chart-5: oklch(0.83 0.06 192);
}
[data-theme="teal"].dark { --primary: oklch(0.7 0.13 192); /* + lighter chart ramp */ }
```

## Rules

- **Tokens only.** `bg-primary`, `text-primary`, `bg-card`, `text-muted-foreground`,
  `border-border`. Never `bg-[#…]`, `text-violet-600`, or inline hex — those break theme
  switching and dark mode.
- **Charts** read `var(--chart-1..5)` (via the shadcn `chart` component's config). They
  re-tint with the theme automatically.
- **Radius** is one token (`--radius`); use `rounded-md`/`rounded-lg`/`rounded-xl`.
- **Dark mode** is the `.dark` class on `<html>` (shell toggle). Every token has a dark
  value, so you get dark mode for free as long as you stay on tokens.
- Add components with the shadcn CLI (`npx shadcn@latest add <name>`) — they're already
  on the latest registry (`radix-ui`, `data-slot`).
