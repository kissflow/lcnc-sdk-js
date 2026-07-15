# AGENTS.md

Guidance for AI coding agents (Claude Code and others) working in this project.
This is a **Kissflow custom Form component** — a standalone Vite/React app that
gets embedded as an iframe inside a Kissflow process/dataform/board form,
scaffolded via `create-component --target form`.

For the full `useForm` hook API (parameters, actions, error handling, child
tables, etc.) see [`README.md`](./README.md) — read it before touching
`src/hooks/useForm.js` or writing new form UI. This file covers project
structure and conventions instead of repeating that guide.

## Architecture

```
src/App.jsx              Entry point — reads input params pushed by the host
                          page (flowType/flowId/instanceId/...) via
                          window.kf.context.watchParams, remounts <Form> on
                          target change.
src/sdk/wrapper.jsx       <SDKWrapper> initializes window.kf; renders
                          children only once the SDK is ready (or an error
                          message if loaded outside Kissflow).
src/hooks/useForm.js      All data logic: fetches config.sections, tracks
                          formData/errors, autosaves on every updateField,
                          exposes runAction() as the single dispatcher for
                          submit/discard/reject/reassign/etc.
src/form/index.jsx        <Form> — composes FormHeader/FormBody/FormAction
                          around useForm(); the reference implementation for
                          how to consume the hook.
src/form/FormBody.jsx,
src/form/shared.jsx       Render config.sections, resolving each field to a
                          component via getFieldComponent/getTableFieldComponent.
src/components/fields/    One component per field type (TextField,
                          DateField, LookupField, GeolocationField, ...).
src/components/tablefields/  Compact variants of the same fields for child-table
                          (Model section) cells.
src/components/ui/        shadcn/ui primitives (Button, Input, Select, ...).
                          Never hand-roll a primitive here — see below.
```

## Adding a new field type

1. Create the field component in `src/components/fields/`. Use the shared
   `<FieldLabel field={field} htmlFor={field.Id} />` and
   `<FieldError error={error} />` — don't re-inline the label/error markup,
   every existing field composes these two.
2. Register it in `src/components/fields/index.js`: add to `FIELD_MAP` keyed
   by the field's `Type`, and/or add a branch in `getFieldComponent(fieldType,
   widget)` if it's identified by `Widget` instead (see the `Scanner` case).
3. If the field can appear in a child table (`Model` section), add a compact
   counterpart in `src/components/tablefields/` and register it the same way
   in `src/components/tablefields/index.js`.

## Styling

- Go through `@/components/ui/*` (shadcn) before adding a new UI primitive —
  run `npx shadcn add <component>` (this project already has `components.json`
  configured) rather than writing one from scratch.
- Use semantic Tailwind tokens (`bg-background`, `text-destructive-foreground`,
  `text-muted-foreground`, ...) instead of hardcoded colors like `bg-white` —
  `src/index.css` defines a full `.dark` token set and every primitive should
  keep working if the host embeds this component in dark mode.

## Key gotchas

- **No `save()`, `isDirty`, or `reset()`.** Every `updateField`/`updateFields`
  call autosaves immediately. `isSaving` reflects that in-flight request;
  `loading` is initial-load/`runAction` only. See the README's *Saving vs
  Submitting* section before adding a Save button — you probably don't need
  one.
- **Always call `runAction(action, extra?)`**, never a flow-specific function.
  It resolves `submit`/`discard`/`reject`/`sendback`/`reassign`/`withdraw`/
  `restart` correctly per `flowType` internally.
- **Hidden fields are pre-filtered.** `useForm` strips validation errors for
  fields hidden by `config.sections`/`IsHidden` before they reach `errors` —
  don't add your own visibility filtering on top.
- This app only runs correctly **inside Kissflow** (`window.kf` is supplied by
  the platform). For local dev, `src/App.jsx` documents reference
  `flowType`/`flowId`/`instanceId` values to bind as input parameters when
  testing standalone via `npm run dev`.

## Commands

- `npm run dev` — Vite dev server over HTTPS (self-signed cert in `cert/`,
  required because Kissflow embeds this over `https`).
- `npm run build` — production build; also emits `dist/manifest.json`
  (`{ Category: "Form", Framework: "React" }`) via the `vite.config.js`
  plugin — required by Kissflow's component upload, don't remove it.
- `npm run zip` — zips `dist/` into `<package-name>.zip` for upload to
  Kissflow as a custom component.
