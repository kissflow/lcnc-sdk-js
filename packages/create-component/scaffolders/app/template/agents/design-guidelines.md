# Design guidelines (read before building UI)

Two rules above all:

1. **The bundled demo (Acme dashboard) is a *wiring* reference, not a design template.**
   It shows how routing, the layout shell, the theme system, and the SDK connect —
   nothing more. **Don't reskin it.** Before building, delete `src/pages/*` and
   `src/data/*` and design fresh for *this* app's domain and data models
   (`lib/kf-context.md`). A finance-approvals app and a field-inspection app should look
   like different products, not the demo with renamed labels.

   **Keep `src/components/ui/*` (the shadcn/ui library) and `src/components/app-shell.jsx`** —
   those are your building blocks, not demo content.

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

## Polish checklist (before you call it done)

- [ ] Looks nothing like the demo dashboard.
- [ ] Built on shadcn/ui primitives (+ custom components where the domain needs them).
- [ ] Zero hardcoded colours — semantic tokens only; works in light **and** dark.
- [ ] Loading + empty + error states for every data view.
- [ ] `primary` used sparingly; the rest neutral.
- [ ] Keyboard focus visible; clickable things are real `<button>` / `<a>` (or shadcn).
- [ ] Reads well on a narrow width.
