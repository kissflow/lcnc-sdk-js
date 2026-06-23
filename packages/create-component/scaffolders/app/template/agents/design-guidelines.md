# Design guidelines (read before building UI)

Two rules above all:

1. **The bundled demo (Acme CRM) is a *wiring* reference, not a design template.**
   It exists to show how routing, the layout, and the SDK connect — nothing more.
   **Do not reskin it.** Before building, delete `src/pages/*`, `src/components/*`,
   and `src/data/*` and design fresh for *this* app's domain and data models
   (`lib/kf-context.md`). A finance approvals app and a field-inspection app should
   look like different products, not the CRM with renamed labels.

2. **Design for a 2025 bar.** Generated UIs tend to look dated. Hit the bar below.

---

## Start from the domain, not a layout

Pick the structure from what the app *does* and its data — don't default to
"sidebar + table" every time:

- A few records, action-oriented → **dashboard / card grid** with primary actions.
- One main list users live in → **list/detail** (master-detail), maybe split-pane.
- A workflow/approval process → **task inbox + record view** with a clear status rail.
- Reporting → **metric cards + charts**, filters up top.
- A single entity to manage → **focused form / detail page**, no nav at all.

Match the navigation to scope: 1–2 areas need no sidebar (just a header); 3+ areas
warrant a sidebar or top tabs. Don't add chrome you don't need.

## Visual system — drop these tokens in and build on them

Put this in `src/styles/tokens.css` and import it once. Modern, neutral, one accent.

```css
:root {
  /* neutrals (slate) */
  --bg: #f8fafc; --surface: #ffffff; --border: #e8edf2;
  --text: #0f172a; --text-muted: #64748b;
  /* one accent — recolor per app/brand */
  --accent: #4f46e5; --accent-soft: #eef2ff; --accent-text: #ffffff;
  /* semantic */
  --success: #16a34a; --warn: #d97706; --danger: #dc2626;
  /* type scale */
  --fs-xs: 12px; --fs-sm: 13px; --fs-md: 14px; --fs-lg: 16px;
  --fs-xl: 20px; --fs-2xl: 28px; --fs-3xl: 36px;
  /* spacing (4px base) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-6: 24px;
  --s-8: 32px; --s-12: 48px;
  /* radius + depth */
  --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-full: 999px;
  --shadow-sm: 0 1px 2px rgb(15 23 42 / 5%);
  --shadow-md: 0 1px 2px rgb(15 23 42 / 4%), 0 8px 24px rgb(15 23 42 / 6%);
  --font: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
}
body { font-family: var(--font); color: var(--text); background: var(--bg); }
```

(For type, you can pull **Inter** from Google Fonts in `index.html` — it instantly
modernises the look vs. default system fonts.)

## What makes it look current — do / don't

**Do**
- Generous whitespace and a clear type hierarchy (big bold titles, calm body, muted meta).
- Cards/surfaces with a **subtle** border *or* soft shadow — pick one, not both heavy.
- Restrained colour: mostly neutrals, the accent only for primary actions/active state.
- Rounded corners (`--r-md` on cards, `--r-sm` on inputs/buttons, pills for tags).
- Real **states**: hover, focus-visible (accent ring), disabled, empty, loading, error.
- **Skeleton loaders** for content, not centred spinners.
- Status as **soft tinted pills** (`background: tint; color: strong`), never raw text.
- Micro-interactions: 120–160ms transitions on hover/press; `transform`/`opacity` only.
- Responsive: usable narrow (the iframe can be mobile — check `kf.env.isMobile`).

**Don't (these read as dated)**
- Heavy 1–2px gray borders on everything / boxes-in-boxes.
- Cramped spacing, tiny 11px gray text everywhere.
- Default browser styling for `<table>`, `<button>`, `<select>`, `<input>`.
- Glossy gradients, bevels, drop-shadow text, harsh pure-black (#000) or pure-white panels on white.
- `alert()`/`confirm()` for feedback — use `kf.client.showInfo` / `showConfirm`.
- One accent colour smeared across every element.

## Components — quick recipes

- **Buttons:** primary = solid `--accent`; secondary = `--surface` + border; tertiary = ghost.
  Comfortable padding (`8px 14px`), `--r-sm`, hover darken ~6%, visible focus ring.
- **Inputs:** label above, `1px var(--border)`, focus → accent border + soft ring; clear error text.
- **Cards:** `--surface`, `--r-md`, `--shadow-sm`, `--s-6` padding; hover lift only if clickable.
- **Lists/tables:** roomy rows (~48px), subtle row hover, sticky header, right-align numbers;
  prefer a card list on mobile.
- **Empty state:** icon/illustration + one-line explanation + a primary CTA. Never a blank screen.
- **Page header:** title (`--fs-2xl`, weight 700) + short subtitle + primary action on the right.

## Polish checklist (before you call it done)

- [ ] Looks nothing like the Acme CRM demo.
- [ ] Loading + empty + error states for every data view.
- [ ] One accent colour, used sparingly; the rest neutral.
- [ ] Consistent spacing (the `--s-*` scale) and radius.
- [ ] Keyboard focus is visible; clickable things are real `<button>`/`<a>`.
- [ ] Reads well on a narrow width.
