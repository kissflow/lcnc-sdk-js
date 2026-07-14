# useForm Hook - Custom Form Builder Guide

The `useForm` hook lets you build fully custom React forms while leaning on Kissflow's
validation, permissions, dynamic field state, and persistence through the underlying form
store. It drives standalone **dataform**, **board**, and **process** records — including
their child tables — from a single dynamic configuration.

For a complete, production-ready reference implementation, see
[`src/form/index.jsx`](./src/form/index.jsx) (header in
[`src/form/FormHeader.jsx`](./src/form/FormHeader.jsx), body in
[`src/form/FormBody.jsx`](./src/form/FormBody.jsx), action bar in
[`src/form/FormAction.jsx`](./src/form/FormAction.jsx) and
[`src/form/ProcessActions.jsx`](./src/form/ProcessActions.jsx)).

## Quick Start

```javascript
import { useForm } from './hooks/useForm'

export function MyCustomForm() {
    const { formData, config, updateField, isSaving, errors } = useForm({
        flowType: 'dataform',
        flowId: 'EmpMaster',
        instanceId: 'emp_123', // omit to create a new record
    })

    // Render fields from `config.sections`, read values from `formData`,
    // push changes with `updateField` — every call autosaves immediately,
    // `isSaving` just reflects that in-flight request.
}
```

## Hook API

### `useForm({ flowType, flowId, viewId, instanceId, activityInstanceId })`

The hook takes a **single options object** (not positional arguments).

#### Parameters

| Key                  | Type   | Required | Description                                                               |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------- |
| `flowType`           | string | yes      | `"dataform"`, `"board"`, or `"process"`                                   |
| `flowId`             | string | yes      | ID of the dataform / board / process (e.g. `"EmpMaster"`)                 |
| `instanceId`         | string | no       | Record instance ID to load. Omit to create a **new** record.              |
| `viewId`             | string | no       | Dataform/board only — the view whose layout & permissions to apply.       |
| `activityInstanceId` | string | no       | Process only — the activity (task) instance the form is being filled for. |

> **Per-flow-type init:** internally the form is initialised as
> `flowInstance.initForm(instanceId, viewId)` for dataform/board, and
> `flowInstance.initForm(instanceId, activityInstanceId)` for process. Pass the one that
> matches your `flowType`.

> **Note:** the legacy page-form signatures (`useForm(formInstanceId)` and the positional
> `useForm(flowType, flowId, instanceId)`) have been **removed**. Calling the hook without
> `flowType`/`flowId` throws.

#### Returns

An object containing:

| Property                                     | Type           | Description                                                                                   |
| -------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------- |
| `formData`                                   | object         | Current values, keyed by field ID. Child-table rows live at `formData[tableId]`.              |
| `config`                                     | object         | Form configuration — `{ formPermission, sections }` (see below).                              |
| `errors`                                     | object         | Validation errors (nested — see _Error Handling_).                                            |
| `loading`                                    | boolean        | True during initial load and while `runAction()` is in flight.                                |
| `error`                                      | string \| null | General error message if an operation failed.                                                 |
| `isSaving`                                   | boolean        | True while an `updateField`/`updateFields` autosave request is in flight. There is no "unsaved changes" state — every edit persists on its own. |
| `isNewRecord`                                | boolean        | True when no `instanceId` was provided.                                                       |
| `updateField(fieldId, value)`                | function       | `=> Promise<boolean>`. Validates, autosaves, and refreshes field state.                       |
| `updateFields(updates)`                      | function       | `=> Promise<boolean>`. Batch autosave of `{ fieldId: value }`.                                |
| `getField(fieldId)`                          | function       | `=> Promise<object>`. Full details for one field.                                             |
| `getFieldOptions(fieldId, tableId?, rowId?)` | function       | `=> Promise<object[]>`. Dropdown/select options; pass `tableId` + `rowId` for a table cell.   |
| `getFormData()`                              | function       | `=> Promise<object>`. Latest data straight from the store.                                    |
| `parseAttachment(fieldId, file)`             | function       | `=> Promise<{ appliedFields, suggestedBy }>`. **Process only** — AI Smart Attachment parsing. |
| `runAction(action, extra?)`                  | function       | `=> Promise<boolean>`. Single dispatcher for every lifecycle action, resolved from `flowType` — see _Actions_. |
| `getTable(tableId)`                          | function       | Returns child-table operations (see _Child Tables_).                                          |
| `processStatus`                              | string         | **Process only** — the item's current status (`Draft`, `InProgress`, `Completed`, …).          |
| `isStartStep`                                | boolean        | **Process only** — true when the current activity is the process's start step.                |
| `formActions`                                | object[]       | **Process only** — ordered workflow-action descriptors for the current step (see _Actions_). Empty array for dataform/board. |
| `getReassignees(query?)`                     | function       | `=> Promise<object[]>`. **Process only** — candidate assignees for the Reassign action.        |

## The `config` object

`config` is the raw `getFormConfiguration()` response, shaped as:

```javascript
{
  formPermission: 'Edit' | 'View',   // outer VBAC gate for the whole flow/view
  sections: [
    {
      Type: 'Section',               // a regular field group
      Id: 'section_1',
      Name: 'Basic Details',
      IsHidden: false,
      Permission: 'Edit',
      Fields: [
        {
          Id: 'firstName',
          Name: 'First Name',
          Type: 'Text',
          Widget: 'SingleLine',
          Required: true,
          Permission: 'Edit',
          IsHidden: false,
          IsReadOnly: false,
          Validations: [ /* ... */ ],
        },
        // ...
      ],
    },
    {
      Type: 'Model',                 // a child table; columns are in Fields[]
      Id: 'lineItems',
      Name: 'Line Items',
      IsHidden: false,
      Permission: 'Edit',
      Fields: [ /* column definitions, same field shape */ ],
    },
  ],
}
```

- **`formPermission`** is the outer access gate. When it is `'View'`, the whole form is
  read-only and it **overrides** every field's own `Permission`.
- Field-level `Permission`, `IsHidden`, `IsReadOnly`, and `Required` are kept in sync
  automatically after each `updateField` / `updateFields` (via `getFieldState()`), so
  conditional show/hide and read-only rules re-render as the user types.
- Note the **capitalized keys** (`Type`, `Id`, `Name`, `Fields`, `IsHidden`, …).

### Rendering from config

```javascript
const { formData, config, updateField } = useForm({
    flowType: 'dataform',
    flowId: 'EmpMaster',
})

const isFormReadOnly = config.formPermission === 'View'
const visibleSections = (config.sections || []).filter((s) => !s.IsHidden)

visibleSections.map((section) => {
    if (section.Type === 'Section') {
        return section.Fields.filter((f) => !f.IsHidden).map((field) => (
            <input
                key={field.Id}
                value={formData[field.Id] || ''}
                disabled={isFormReadOnly || field.IsReadOnly}
                onChange={(e) => updateField(field.Id, e.target.value)}
            />
        ))
    }
    if (section.Type === 'Model') {
        // child table — see "Child Tables" below
    }
})
```

## Usage Examples

### Basic form with field updates

```javascript
import { useForm } from './hooks/useForm'

export function EmployeeForm() {
    const { formData, updateField, runAction, isSaving, loading, isNewRecord } =
        useForm({
            flowType: 'dataform',
            flowId: 'EmpMaster',
            instanceId: 'emp_123',
        })

    // Only a new record needs an explicit Submit — runAction('submit')
    // finalizes the draft. An existing record has nothing to do here; every
    // updateField call already autosaved.
    const handleSubmit = async () => {
        if (!isNewRecord) return
        const success = await runAction('submit')
        if (success) console.log('Record submitted!')
    }

    return (
        <div>
            <h2>{isNewRecord ? 'New Employee' : 'Edit Employee'}</h2>
            {isSaving && <span>Saving…</span>}
            <input
                value={formData.firstName || ''}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="First Name"
            />
            {isNewRecord && (
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            )}
        </div>
    )
}
```

### New record

```javascript
const { runAction, isNewRecord } = useForm({
    flowType: 'dataform',
    flowId: 'EmpMaster',
})
// No instanceId => isNewRecord === true; runAction('submit') finalizes the draft record.
```

## Saving vs Submitting (dataform / board)

Omitting `instanceId` doesn't just mark the form dirty locally — `initForm` immediately
creates a real **draft** record on the backend, and every `updateField` / `updateFields`
call autosaves straight to that draft (there's no separate "unsaved changes buffered
client-side" state to worry about).

Because of that autosave, `runAction('submit')` behaves differently depending on
`isNewRecord`:

- **Existing record** (`isNewRecord === false`): fields already autosaved as you edited
  them, so `runAction('submit')` only validates.
- **New record** (`isNewRecord === true`, `flowType` `dataform` or `board`): the draft
  still needs to be **finalized** — `runAction('submit')` validates, then calls the SDK's
  `submitItem` to turn the draft into a submitted record, and flips `isNewRecord` to
  `false`.

Only show a footer action for a **new** dataform/board record — Submit
(`runAction('submit')`) and Discard (`runAction('discard')`); an existing record has no
footer action at all, since there's nothing left to persist. See
`src/form/FormAction.jsx` for the reference pattern (it returns `null` once `isNewRecord`
is `false`), and `src/form/FormHeader.jsx` for how to surface autosave status
(`isSaving`) instead of a Save button.

This finalize step does not apply to `flowType: 'process'` — process forms always expose
a separate `submit` workflow action (see _Actions_ below).

### Displaying validation errors

```javascript
const { formData, errors, updateField } = useForm({
    flowType: 'dataform',
    flowId: 'EmpMaster',
})

<input
    value={formData.email || ''}
    onChange={(e) => updateField('email', e.target.value)}
    type="email"
/>
{errors.email && <span className="error">{errors.email[0]}</span>}
```

`errors` refreshes on every `updateField` call — no separate "Save" click needed to see
them.

### Multiple field updates

```javascript
const { updateFields } = useForm({ flowType: 'dataform', flowId: 'EmpMaster' })

await updateFields({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
})
```

### Discard a draft

```javascript
const { runAction, isNewRecord } = useForm({
    flowType: 'dataform',
    flowId: 'EmpMaster',
})
// Only meaningful while isNewRecord is true — deletes the draft outright
// (Dataform/Board) or runs the process `discard` workflow action.
if (isNewRecord) await runAction('discard')
```

There's no `reset()` — since every field autosaves immediately, there's no
local "unsaved changes" buffer to revert to. `runAction('discard')` is the
equivalent of "I don't want this record" for a still-in-progress draft.

## Child Tables

For `Model` sections, get table operations with `getTable(tableId)`. **Rows are read from
`formData[tableId]`** — the table object itself does **not** expose a `rows` property.

```javascript
const { formData, getTable } = useForm({
    flowType: 'process',
    flowId: 'PurchaseOrder',
})

const table = getTable('lineItems')
const rows = formData.lineItems || []

// Mutations refresh formData automatically:
await table.addRow({ item: 'Widget', qty: 2 })
await table.addRows([{ item: 'A' }, { item: 'B' }])
await table.updateRow(rowId, 'qty', 5)
await table.deleteRow(rowId)
await table.deleteRows([rowId1, rowId2])

const field = await table.getRowField(rowId, 'qty')
const selected = await table.getSelectedRows()
```

`getTable` returns:

| Method                             | Description                             |
| ---------------------------------- | --------------------------------------- |
| `addRow(rowData)`                  | Append a row, then refresh `formData`.  |
| `addRows(rows)`                    | Append multiple rows.                   |
| `updateRow(rowId, fieldId, value)` | Update one cell.                        |
| `deleteRow(rowId)`                 | Delete one row.                         |
| `deleteRows(rowIds)`               | Delete multiple rows.                   |
| `getRowField(rowId, fieldId)`      | `=> Promise<object>` — a row's field.   |
| `getSelectedRows()`                | `=> Promise<object[]>` — selected rows. |

## Field Options (dropdowns / lookups)

```javascript
const { getFieldOptions } = useForm({
    flowType: 'dataform',
    flowId: 'EmpMaster',
})

const options = await getFieldOptions('department') // top-level field
const cellOptions = await getFieldOptions('item', 'lineItems', rowId) // table cell
```

## Smart Attachment Parsing (process only)

`parseAttachment` triggers AI document parsing on a Smart Attachment field. Matching empty
fields are auto-filled by the platform and `formData` is refreshed for you.

```javascript
const { parseAttachment } = useForm({
    flowType: 'process',
    flowId: 'InvoiceApproval',
})

const { appliedFields, suggestedBy } = await parseAttachment(
    'invoiceFile',
    file
)
```

Calling it for a non-process flow throws.

## Actions

`runAction(action, extra?)` is the **single dispatcher for every lifecycle action** —
it resolves its behavior from `flowType` internally, so the same function works
uniformly for a Discard button, a Submit button, and every process workflow button. This
is deliberate: don't special-case which function to call per flow type in your UI: always
call `runAction(action, extra?)`.

- **Dataform/board**: only `'submit'` and `'discard'` are supported (see _Saving vs
  Submitting_ and _Discard a draft_ above).
- **Process**: `action` is one of `submit`, `reject`, `sendback`, `reassign`, `withdraw`,
  `restart`, `discard`. `extra` carries action-specific payload: `{ comment }` for
  reject/sendback/withdraw, `{ stepId, comment }` for sendback, `{ reassignTo, comment,
  reassignType }` for reassign. `submit`/`reject`/`sendback`/`reassign` validate the form
  first and return `false` (without transitioning) if there are errors — these persist
  data alongside the transition (a comment, a corrected field). `withdraw`/`restart`/
  `discard` skip validation — they're exit/reset actions with no data of their own to
  lose.

For `flowType: 'process'`, `formActions` gives you the ordered list of workflow actions
valid at the item's **current step** — resolved from `processStatus` + `isStartStep`
(e.g. a fresh Draft item shows `discard`, `submit`; an approver's step shows `reassign`,
`sendback`, `reject`, `submit`). There is no `save` action in this list — every field
edit already autosaved, so only real workflow transitions are listed. Dataform/board
always return `[]` for `formActions` (their Discard/Submit buttons aren't step-dependent
the way process actions are).

```javascript
const {
    formActions,     // [{ key, label, primary?, destructive?, requiresComment?, requiresReassignee?, confirm? }, ...]
    runAction,
    getReassignees,
} = useForm({ flowType: 'process', flowId: 'PurchaseOrder', instanceId, activityInstanceId })

formActions.map((action) => (
    <button key={action.key} onClick={() => runAction(action.key, { comment, reassignTo })}>
        {action.label}
    </button>
))
```

Each descriptor's `requiresComment` / `requiresReassignee` / `confirm` flags tell you
whether to open a confirmation modal before calling `runAction` — see
`ProcessActions.jsx` for the reference modal. `getReassignees(query?)` returns candidate
users for the Reassign picker.

## Error Handling

Two levels of errors:

1. **General error** (`error`) — set when an operation fails (network, init, etc.).

    ```javascript
    if (error) console.error('General error:', error)
    ```

2. **Validation errors** (`errors`) — the raw `getValidationErrors()` response. It is
   **nested**, not a flat map. Top-level fields appear under `_root`, and child-table
   errors are keyed by table → row → field:

    ```javascript
    {
      _root: { firstName: ['First name is required'], email: ['Invalid email'] },
      lineItems: {
        row_1: { qty: ['Must be greater than 0'] },
      },
    }
    ```

    The validated branches of `runAction` (`submit`/`reject`/`sendback`/`reassign`)
    inspect this whole structure and return `false` (setting `error`) if any `_root`
    field or any table-row field has messages. When binding a single field's error in the
    UI, read it from the shape your render layer normalises (the reference
    `src/form/index.jsx` passes each field its own `errors[fieldId]`).

    **Hidden fields are filtered out automatically.** The underlying `getValidationErrors()`
    validates every field regardless of visibility, which would otherwise block
    `runAction('submit')` on a required field the user can't even see. `useForm`
    cross-references the current `config.sections` (including per-field `IsHidden` and
    per-section `IsHidden`) and strips out errors for anything not currently visible before
    they ever reach `errors` or the has-errors check — you don't need to filter them yourself.

## Loading State

Two different signals, don't conflate them:

- `loading` — `true` during the initial load and while `runAction()` is in flight.
- `isSaving` — `true` only while a field autosave (`updateField`/`updateFields`) is in
  flight. This is what a header-style "Saving…" indicator should watch (see
  `src/form/FormHeader.jsx` for the reference pattern) — it's typically a much shorter,
  much more frequent blip than `loading`.

```javascript
<button disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
```

## Best Practices

1. **Render from `config.sections`** rather than hard-coding fields — permissions and
   visibility stay correct as rules evaluate.
2. **Respect `formPermission === 'View'`** and each field's `IsReadOnly` / `IsHidden`.
3. **Always surface validation errors** before/after `runAction('submit')`.
4. **Show `loading`** to disable interaction during async work; show `isSaving`
   separately as a lightweight autosave indicator (don't block input on it).
5. **Don't build a Save button for existing records** — every `updateField`/
   `updateFields` call already persisted. Only new dataform/board records need a visible
   Submit/Discard pair (see _Saving vs Submitting_, _Discard a draft_).
6. **Always call `runAction(action, extra?)`** rather than special-casing which function
   to call per flow type — it resolves the right behavior internally.

## Troubleshooting

### `useForm requires (flowType, flowId) ...`

You called the hook without `flowType`/`flowId`. The legacy page-form form is gone — always
pass at least `{ flowType, flowId }`.

### `SDK not initialized`

Ensure the component is rendered inside the SDK wrapper (`window.kf` must exist). See
`src/sdk/`.

### Validation errors not updating

They refresh automatically after `updateField` / `updateFields` / `runAction`. No extra call needed.

### Table rows not showing

Read rows from `formData[tableId]`, not from the object returned by `getTable`.

## Support

1. Study the reference component: [`src/form/index.jsx`](./src/form/index.jsx).
2. Review the form-store validation rules.
3. Check the Kissflow SDK documentation.
