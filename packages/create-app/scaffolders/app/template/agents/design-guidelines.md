# Design guidelines (read before building UI)

Two rules above all:

1. **Everything you can SEE is a *wiring reference* — build the app's own UI, don't inherit the demo.**
   The Acme dashboard (`src/pages/*`, `src/data/*`) **and the shell** (`src/components/app-shell.jsx`)
   exist only to show HOW the pieces connect — routing, the `<KfApp layout=…>` mechanism, navigation
   (`NAV_ITEMS` → `KfLink` / `useKfRouter`), the theme system, dark mode, the mobile drawer, the SDK.
   **None of it is a base to tweak.** Before building: **delete `src/pages/*` + `src/data/*`, and
   rebuild `src/components/app-shell.jsx` from scratch** for THIS app. Learn the nav + global wiring
   from the default, then design your own shell and screens. A finance-approvals app and a
   field-inspection app must look like **different products** — not the demo with renamed labels and
   a recoloured sidebar.

   **The only things you keep as-is:** the shadcn/ui primitives in `src/components/ui/*` (your
   component library) and the app-ui framework wiring (`KfApp` / `layout`, `KfLink`, `useKfRouter`,
   the theme registry, the dynamic `Form` engine). The shell, the navigation, the pages, and how a
   record form is presented are **all yours to design** — see "Build the app's shell + record form".

2. **Design for a 2026 bar.** Generated UIs tend to look dated. Hit the bar below.

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
a sidebar or top tabs. Don't add chrome you don't need.

## Build the app's shell + record form — MANDATORY (don't inherit the defaults)

The scaffold's `app-shell.jsx` and the dynamic `Form` are **references + working defaults, not a
base to tweak.** The #1 reason generated apps all look the same is shipping the default shell with
new colours and nav items. Instead:

- **App shell (`src/components/app-shell.jsx`) — REBUILD it for this app.** The default only exists
  to show the mechanics (the `layout` prop, `NAV_ITEMS` → `KfLink`, dark toggle, theme switcher,
  mobile drawer). Design the shell the app actually needs: pick the pattern from the audience + use
  case — a consumer / mobile app → a **bottom tab-bar**; an admin / ops tool → a **sidebar**; a
  focused single-purpose tool → a **top header** (or no chrome at all — see Structure). Design the
  brand, the nav shape + labels + icons, and the global chrome (search, profile, notifications, a
  dev role switcher — see below) from the domain. **Two different apps must have visibly different
  shells.** Litmus test: if your shell is the default sidebar with a new logo + colours, you haven't
  done this.
  - **Global concerns live in the shell** — app-wide providers, the theme + dark toggle, the
    top-level navigation, and (in dev) the role switcher. Anything every screen needs goes here.
- **Record form (`src/components/form`) — design it per record.** The dynamic Form renders every
  field generically; that's a functional default, not a designed form. For each record you MUST
  group + order fields into meaningful **sections**, hide the noise, choose the right chrome (inline
  panel vs `Dialog` vs `Sheet` vs full page), and style it with the app's tokens + section headers.
  Never drop the raw default Form into a modal and call it done.

## Role-gate the UI — and add a dev role switcher

Kissflow apps are multi-role, and each role should get a **different UI** — not the same screen with
buttons hidden. Gate nav, pages, and actions by role using `kf.user.AppRoles` (role ids/names are in
`lib/kf-context.md`): a Passenger and an Admin should get different navigation and different screens.

To build + test those role-specific views in **dev**, use the SDK's dev-only role switch:
- `const { roles, currentRoles } = await kf.app.getRoles()` — all app roles + the user's current role(s).
- `await kf.app.switchRole({ roleId })` (or `{ roleName }`) — switches the active role **live** (the
  platform picks it up, no reload). **Dev accounts only — blocked / no-op in production.**

**Put a small role switcher in the shell** (a `Select` / `DropdownMenu` over `roles` that calls
`switchRole`, then re-fetches) so testers can flip roles in dev. **Guard it to dev:** the methods
throw outside a dev account, so wrap `getRoles()` in a try/catch and only render the switcher when it
resolves — it then simply doesn't appear in production.

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

- [ ] Looks nothing like the demo dashboard — and the **shell is purpose-built** (not the default sidebar recoloured).
- [ ] Nav, pages & actions are **role-gated** (`kf.user.AppRoles`); a **dev role switcher** is in the shell.
- [ ] Built on shadcn/ui primitives (+ custom components where the domain needs them).
- [ ] Zero hardcoded colours — semantic tokens only; works in light **and** dark.
- [ ] Loading + empty + error states for every data view.
- [ ] `primary` used sparingly; the rest neutral.
- [ ] Keyboard focus visible; clickable things are real `<button>` / `<a>` (or shadcn).
- [ ] Reads well on a narrow width.
