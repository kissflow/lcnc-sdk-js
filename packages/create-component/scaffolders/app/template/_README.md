# <%= projectName %>

A full custom UI for your Kissflow app, built with
[`@sooryakanth/app-ui`](https://www.npmjs.com/package/@sooryakanth/app-ui) — a Vite +
React framework with **folder-based routing** (`src/pages/**`) that renders inside
Kissflow and keeps the browser URL in sync with your routes.

## Develop

```bash
npm install
npm run dev          # https://localhost:3000
```

Then in Kissflow, open your app → **Settings → Custom UI**, toggle it on,
paste `https://localhost:3000`, and Save. Open the app — your UI renders full-screen
under `/application/<your-app-id>/ui`.

## Routing

Add a file under `src/pages/`:

| File | Route |
| --- | --- |
| `src/pages/index.jsx` | `/` |
| `src/pages/contacts/index.jsx` | `/contacts` |
| `src/pages/contacts/[id].jsx` | `/contacts/:id` |
| `src/pages/settings.jsx` | `/settings` |

Navigate with `<KfLink to="/contacts">` or `useKfRouter().push("/contacts")`. The parent
Kissflow URL mirrors the route automatically.

This project ships with a small **Acme CRM** demo (dashboard, searchable contacts,
a dynamic contact detail route, and a settings page using the live SDK). Replace
the contents of `src/pages/` with your own app.

## Use the Kissflow SDK

```jsx
import { useKf } from "@sooryakanth/app-ui";

function MyComponent() {
  const kf = useKf();
  // kf.user, kf.account, kf.app, kf.api(...), ...
}
```

## Ship it

```bash
npm run zip          # builds + produces <%= projectName %>.zip
```

Upload the zip in **Settings → Custom UI** (Zip mode) instead of a dev URL.
