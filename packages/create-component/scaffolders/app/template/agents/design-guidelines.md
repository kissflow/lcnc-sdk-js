# Design guidelines (read before building UI)

Two rules above all:

1. **The bundled demo (Acme dashboard) is a *wiring* reference, not a design template.**
   It shows how routing, the layout shell, the theme system, and the SDK connect —
   nothing more. **Don't reskin it.** Before building, delete `src/pages/*` and
   `src/data/*` and design fresh for *this* app's domain and data models
   (`lib/kf-context.md`). A finance-approvals app and a field-inspection app should look
   like different products, not the demo with renamed labels.

   **Keep `src/components/ui/*` (the shadcn/ui primitives) as your library** — but
   `src/components/app-shell.jsx` and `src/components/form/*` are **starting points to ADAPT,
   not fixtures to keep.** Shipping either one essentially unchanged (recoloured at most) is the
   single biggest reason generated apps feel generic — see "Adapt the shell + the record form".

2. **Design for a 2025 bar.** Generated UIs tend to look dated. Hit the bar below.

---

## You start with shadcn/ui — use it

This project ships **shadcn/ui** (New York style) pre-installed in `src/components/ui/*`:
Button, Card, Table, Dialog, Sheet, Select, Command (⌘K / combobox), DropdownMenu,
Popover, Tabs, Badge, Avatar, Calendar / DatePicker, Checkbox, Switch, Input, Label,
Tooltip, Accordion, Separator, Skeleton, Sonner (toasts), and Chart (recharts wrapper).

**This is your quick-start palette — reach for it first** so you get a polished,
accessible, consistent result out of the box. Compose and extend these freely, and
**build your own components on top** when the domain needs something shadcn doesn't have
(a kanban board, a gantt, a map, a specialised record card) — style those with the same
tokens below so they sit alongside the primitives seamlessly.

- Need a component that isn't here? Add it: `npx shadcn@latest add <name>`.
- Charts: use **recharts** via the shadcn `Chart` wrapper (`ui/chart.jsx`) — it themes
  series with `--chart-1..5` for you.

## Colour + theme — tokens only, never hex

The palette is a **token system** (shadcn + Tailwind v4, oklch) already wired in
`src/index.css`. **Never hardcode colours** (`#4f46e5`, `bg-[#f8fafc]`) — always use the
semantic Tailwind utilities so light/dark and theme-switching just work:

| use | utility |
|---|---|
| page / app background | `bg-background` `text-foreground` |
| cards, panels, popovers | `bg-card` / `bg-popover` (+ `-foreground`) |
| muted / secondary text | `text-muted-foreground` |
| primary action / active | `bg-primary text-primary-foreground` |
| subtle fills / hovers | `bg-muted` / `bg-accent` |
| borders, inputs, rings | `border-border` `ring-ring` |
| destructive | `bg-destructive` / `text-destructive` |
| chart series | `var(--chart-1..5)` (via the Chart wrapper) |

**Accent + light/dark are switchable** via the theme registry — see
[`theming.md`](./theming.md). Presets (violet, blue, emerald, rose, amber, orange) each
recolour `--primary` / `--ring` / `--sidebar` / `--chart-*` in light **and** dark by
setting `data-theme` on `<html>`. Pick the preset that fits the app's brand (or add one)
instead of hand-picking hex. Dark mode is `class="dark"` on `<html>` — already toggled in
the shell.

## What makes it look current — do / don't

**Do**
- Generous whitespace + a clear type hierarchy (big bold titles, calm body, muted meta).
- Cards with a **subtle** border *or* soft shadow — not both heavy (`border bg-card`).
- Restrained colour: mostly neutral tokens; `primary` only for primary actions / active state.
- Rounded corners (shadcn's `rounded-lg` / `rounded-md`; pills = `rounded-full` for tags).
- Real **states**: hover, `focus-visible` ring, disabled, empty, loading, error.
- **Skeleton** loaders (`ui/skeleton`) for content, not centred spinners.
- Status as soft **`Badge`s** (tinted variants), never raw coloured text.
- Micro-interactions: 120–160ms transitions on hover/press; `transform` / `opacity` only.
- Responsive: usable narrow — the iframe can be mobile (`kf.env.isMobile`); the shell
  already has a mobile drawer, follow that pattern.

**Don't (these read as dated)**
- Hardcoded hex / arbitrary `bg-[#...]` — breaks theming + dark mode.
- Heavy 1–2px gray borders on everything / boxes-in-boxes.
- Cramped spacing, tiny gray text everywhere.
- Raw browser `<table>` / `<button>` / `<select>` / `<input>` — use the shadcn equivalents.
- Glossy gradients, bevels, drop-shadow text, pure-black (`#000`) on white.
- `alert()` / `confirm()` — use a `sonner` toast or a shadcn `Dialog`, or the SDK's
  `kf.client.showInfo` / `showConfirm`.

## Structure — start from the domain, not a layout

Pick the structure from what the app *does* and its data — don't default to
"sidebar + table" every time:

- A few records, action-oriented → **dashboard / card grid** with primary actions.
- One main list users live in → **list/detail** (master-detail), maybe split-pane.
- A workflow / approval process → **task inbox + record view** with a clear status rail.
- Reporting → **metric cards + charts**, filters up top.
- A single entity to manage → **focused form / detail page**, no nav at all.

Match navigation to scope: 1–2 areas need no sidebar (just a header); 3+ areas warrant
the shell's sidebar or top tabs. Don't add chrome you don't need.

## Adapt the shell + the record form — MANDATORY

Two scaffold pieces are working *starting points*, not finished UI, and the default failure is
shipping them almost untouched. Don't:

- **App shell (`src/components/app-shell.jsx`)** — do NOT merely recolour it and add nav items.
  Pick the shell that fits THIS app + audience and rebuild it accordingly: a consumer / mobile
  app usually wants a **bottom tab-bar**; an admin/ops tool a **sidebar**; a single-purpose tool
  just a **top header** (or no chrome — see Structure above). Restructure the header (brand,
  search, profile, notifications, role switch), the nav shape, and the content frame to the
  domain. Two different apps must have visibly different shells — not the same sidebar in a
  different colour.
- **Record form (`src/components/form`)** — the dynamic Form renders every field generically;
  that is a functional default, not a designed form. For each record you MUST adapt it to the
  app + the flow: group and order fields into meaningful **sections**, de-emphasise or hide the
  noise, choose the right chrome for the context (inline panel vs `Dialog` vs `Sheet` vs full
  page), and style it with the app's tokens, spacing, and section headers so it reads as built
  for this app. Never drop the raw default Form into a modal and call it done.

## Data patterns — multi-flow reads & derived metrics

Two patterns that keep multi-flow, report-derived apps robust:

- **Scope error/empty state to the CORE flow(s) only.** When a page reads **multiple flows**, don't
  aggregate one `error` across all of them and blank the whole page. A permission error on a
  *secondary* lookup — a flow the current role may not be allowed to read (e.g. Category, Supplier) —
  must **degrade to empty / a secondary-error notice, NOT blank the entire page**. Key the page-level
  `ErrorState` on the core flow(s); surface secondary failures as an empty state or an inline
  `secondaryError`. (A role without Category/Supplier access should still see the dashboard, not a
  blanked screen.)

- **Derive computed values in ONE shared helper — but prefer platform formulas where they fit.**
  Kissflow **does persist** process-level computed fields and child-table column formulas through
  publish (the old "formulas strip on publish" belief was wrong) — so a clean *per-record* formula
  (a line total, a signed quantity) is best modelled as a **platform computed field**: single source,
  no UI math. Reach for client-side derivation only for values that genuinely aren't on the record —
  **cross-flow rollups** (on-hand across all movements), **report-derived** aggregates, low-stock /
  avg-consumption. For those, put every derivation in one shared **`src/lib/metrics.js`** the whole app
  imports (one canonical on-hand / valuation helper), not recomputed per component — one source of
  truth, one place to fix. (PATTERN — create `metrics.js` per app; not pre-scaffolded.)

## Polish checklist (before you call it done)

- [ ] Looks nothing like the demo dashboard.
- [ ] Built on shadcn/ui primitives (+ custom components where the domain needs them).
- [ ] Zero hardcoded colours — semantic tokens only; works in light **and** dark.
- [ ] Loading + empty + error states for every data view.
- [ ] `primary` used sparingly; the rest neutral.
- [ ] Keyboard focus visible; clickable things are real `<button>` / `<a>` (or shadcn).
- [ ] Reads well on a narrow width.
