# Building <%= projectName %> (Kissflow App UI for <%= appId %>)

This is a **custom UI for Kissflow app `<%= appId %>`** — a Vite + React SPA
(`@kissflow/app-ui`) that renders full-screen inside Kissflow and talks to it
through the Kissflow SDK.

## Your role

You are helping the developer **build the custom UI for their Kissflow app** —
screens, components, and data wiring. Treat that as the whole job: understand the
app's data and what the developer wants, then build and refine pages for it.

**Work here:**
- `src/pages/**` — the screens (file = route)
- `src/components/**` — shared UI, the layout/shell
- `src/**`, styles, and small helpers in `lib/` you author

**Do NOT** (out of scope — don't go here unless the developer explicitly asks):
- Don't modify `@kissflow/app-ui`, the SDK, or anything in `node_modules` — the
  framework is a black box you build **on top of**, not something to "improve".
- Don't hand-edit `lib/kf-context.md` / `lib/kf-schema.json` — they're generated;
  refresh with `npm run kf:sync`.
- Don't rewrite `agents/*` or this `CLAUDE.md` — they're your reference, not work
  product.
- If the framework seems to be missing something, build around it in the app (or
  tell the developer) — don't patch the package.

Default to **building the app**. When the request is vague, propose concrete
screens based on the app's data models (see below) and get building.

## First: know the app's data

Before building or changing pages, make sure you know the app's data models and roles:

1. Ensure `.env` exists (copy `.env.example`, fill the `KF_*` keys).
2. Run **`npm run kf:sync`** — pulls this app's schema into `lib/`.
3. **Read [`lib/kf-context.md`](./lib/kf-context.md)** — the available data models
   (dataforms/processes), their fields, and the app's roles. Build against these;
   don't invent field or model ids. (`lib/kf-schema.json` is the machine-readable copy.)

Re-run `npm run kf:sync` whenever the app's models/roles change.

## Routing — file-based (`src/pages/**`)

| File | Route |
| --- | --- |
| `src/pages/index.jsx` | `/` |
| `src/pages/contacts/index.jsx` | `/contacts` |
| `src/pages/contacts/[id].jsx` | `/contacts/:id` (dynamic) |
| `src/pages/settings.jsx` | `/settings` |

Navigate with `<KfLink to="…">` or `const r = useKfRouter(); r.push("…")`. The parent
Kissflow browser URL mirrors the route automatically — never call the SDK for routing.

## Layouts (like Next.js)

- **Root layout:** `src/components/app-shell.jsx`, passed once via
  `<KfApp routes={routes} layout={AppShell} />` in `src/main.jsx`. It's persistent
  (renders once; only the route swaps in as `children`).
- **Section layout:** a file next to a folder of the same name (e.g.
  `src/pages/contacts.jsx` beside `src/pages/contacts/`) wraps that section — render
  an `<Outlet/>`.
- A page sets the shell header with `usePageTitle("Contacts")`.

## Talking to Kissflow (in the browser)

```jsx
import { useKf } from "@kissflow/app-ui";
const kf = useKf();                                   // initialized SDK
kf.user;  kf.account;                                 // current user / account
const form = kf.app.getDataform("<DataformId>");      // a data model handle
const { items } = await form.getItems();
```

**Read [`agents/kissflow-sdk.md`](./agents/kissflow-sdk.md)** for the full SDK API —
dataform / process / board CRUD, decision tables, app & page variables, `kf.client`
(toasts, confirm), `kf.formatter`, and `kf.api`. Combine it with `lib/kf-context.md`
(the actual model/field/role ids) to write correct data calls.

## Conventions

- Pure client SPA — **no SSR, no server code, no data fetching at build time**. Each
  page is `"use client"`-style React; fetch data at runtime via `kf.api`.
- Keep pages in `src/pages/`, shared UI in `src/components/`, helpers in `src/`/`lib/`.
- Run `npm run dev` (https://localhost:3000) to preview; `npm run zip` to package for upload.
