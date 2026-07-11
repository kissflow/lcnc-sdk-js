# useForm Hook - Custom Form Builder Guide

The `useForm` hook lets you build fully custom React forms while leaning on Kissflow's
validation, permissions, dynamic field state, and persistence through the underlying form
store. It drives standalone **dataform**, **board**, and **process** records — including
their child tables — from a single dynamic configuration.

For a complete, production-ready reference implementation, see
[`src/form/index.jsx`](./src/form/index.jsx) (layout in
[`src/form/layout.jsx`](./src/form/layout.jsx), workflow action bar in
[`src/form/ProcessActions.jsx`](./src/form/ProcessActions.jsx)).

## Quick Start

```javascript
import { useForm } from './hooks/useForm'

export function MyCustomForm() {
    const { formData, config, updateField, save, errors, isDirty } = useForm({
        flowType: 'dataform',
        flowId: 'EmpMaster',
        instanceId: 'emp_123', // omit to create a new record
    })

    // Render fields from `config.sections`, read values from `formData`,
    // push changes with `updateField`, persist with `save`.
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
| `loading`                                    | boolean        | True during initial load and while saving.                                                    |
| `error`                                      | string \| null | General error message if an operation failed.                                                 |
| `isDirty`                                    | boolean        | True if the form has unsaved changes.                                                         |
| `isNewRecord`                                | boolean        | True when no `instanceId` was provided.                                                       |
| `updateField(fieldId, value)`                | function       | `=> Promise<boolean>`. Validates, updates data, and refreshes field state.                    |
| `updateFields(updates)`                      | function       | `=> Promise<boolean>`. Batch update of `{ fieldId: value }`.                                  |
| `getField(fieldId)`                          | function       | `=> Promise<object>`. Full details for one field.                                             |
| `getFieldOptions(fieldId, tableId?, rowId?)` | function       | `=> Promise<object[]>`. Dropdown/select options; pass `tableId` + `rowId` for a table cell.   |
| `getFormData()`                              | function       | `=> Promise<object>`. Latest data straight from the store.                                    |
| `parseAttachment(fieldId, file)`             | function       | `=> Promise<{ appliedFields, suggestedBy }>`. **Process only** — AI Smart Attachment parsing. |
| `save()`                                     | function       | `=> Promise<boolean>`. Validates, then finalizes new dataform/board records (see _Saving vs Submitting_). |
| `reset()`                                    | function       | `=> void`. Reverts to last saved data and clears errors.                                      |
| `getTable(tableId)`                          | function       | Returns child-table operations (see _Child Tables_).                                          |
| `processStatus`                              | string         | **Process only** — the item's current status (`Draft`, `InProgress`, `Completed`, …).          |
| `isStartStep`                                | boolean        | **Process only** — true when the current activity is the process's start step.                |
| `formActions`                                | object[]       | **Process only** — ordered workflow-action descriptors for the current step (see _Process Workflow Actions_). Empty array for dataform/board. |
| `runProcessAction(action, extra?)`           | function       | `=> Promise<boolean>`. **Process only** — executes a workflow transition (see _Process Workflow Actions_). |
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
    const { formData, updateField, save, isDirty, loading, isNewRecord } =
        useForm({
            flowType: 'dataform',
            flowId: 'EmpMaster',
            instanceId: 'emp_123',
        })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await save()
        if (success) console.log('Form saved!')
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isNewRecord ? 'New Employee' : 'Edit Employee'}</h2>
            <input
                value={formData.firstName || ''}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="First Name"
            />
            <button disabled={loading || !isDirty}>
                {loading ? 'Saving...' : 'Save'}
            </button>
        </form>
    )
}
```

### New record

```javascript
const { save, isNewRecord } = useForm({
    flowType: 'dataform',
    flowId: 'EmpMaster',
})
// No instanceId => isNewRecord === true; save() finalizes the draft record.
```

## Saving vs Submitting (dataform / board)

Omitting `instanceId` doesn't just mark the form dirty locally — `initForm` immediately
creates a real **draft** record on the backend, and every `updateField` / `updateFields`
call autosaves straight to that draft (there's no separate "unsaved changes buffered
client-side" state to worry about).

Because of that autosave, `save()` behaves differently depending on `isNewRecord`:

- **Existing record** (`isNewRecord === false`): fields already autosaved as you edited
  them, so `save()` only validates.
- **New record** (`isNewRecord === true`, `flowType` `dataform` or `board`): the draft
  still needs to be **finalized** — `save()` validates, then calls the SDK's `submitItem`
  to turn the draft into a submitted record, and flips `isNewRecord` to `false`.

If your UI only has one button for dataform/board, label it based on `isNewRecord`
(`'Submit'` for a new record, `'Save'` for an existing one) — see
`src/form/layout.jsx`'s footer bar for the reference pattern.

This finalize step does not apply to `flowType: 'process'` — process forms always expose
a separate `submit` workflow action (see _Process Workflow Actions_), so `save()` stays
validate-only for every process status and just leaves the item wherever it is in the
workflow.

### Displaying validation errors

```javascript
const { formData, errors, updateField, save } = useForm({
    flowType: 'dataform',
    flowId: 'EmpMaster',
})

<input
    value={formData.email || ''}
    onChange={(e) => updateField('email', e.target.value)}
    type="email"
/>
{errors.email && <span className="error">{errors.email[0]}</span>}
<button onClick={() => save()}>Save</button>
```

### Multiple field updates

```javascript
const { updateFields } = useForm({ flowType: 'dataform', flowId: 'EmpMaster' })

await updateFields({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
})
```

### Reset

```javascript
const { reset, isDirty } = useForm({
    flowType: 'dataform',
    flowId: 'EmpMaster',
})
reset() // reverts to last saved data, clears errors, sets isDirty to false
```

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

## Process Workflow Actions (process only)

For `flowType: 'process'`, `formActions` gives you the ordered list of workflow actions
valid at the item's **current step** — resolved from `processStatus` + `isStartStep`
(e.g. a fresh Draft item shows `save`, `discard`, `submit`; an approver's step shows
`save`, `reassign`, `sendback`, `reject`, `submit`). Dataform/board always return `[]`.

```javascript
const {
    formActions,     // [{ key, label, primary?, destructive?, requiresComment?, requiresReassignee?, confirm? }, ...]
    runProcessAction,
    getReassignees,
    save,
} = useForm({ flowType: 'process', flowId: 'PurchaseOrder', instanceId, activityInstanceId })

formActions.map((action) => (
    <button
        key={action.key}
        onClick={() =>
            action.key === 'save'
                ? save()
                : runProcessAction(action.key, { comment, reassignTo })
        }
    >
        {action.label}
    </button>
))
```

- `runProcessAction(action, extra?)` — `action` is one of `submit`, `reject`, `sendback`,
  `reassign`, `withdraw`, `restart`, `discard` (**not** `save` — that's the plain `save()`
  above). `extra` carries action-specific payload: `{ comment }` for reject/sendback/withdraw,
  `{ stepId, comment }` for sendback, `{ reassignTo, comment, reassignType }` for reassign.
  `submit` validates the form first and returns `false` (without transitioning) if there are
  errors, mirroring `save()`.
- Each descriptor's `requiresComment` / `requiresReassignee` / `confirm` flags tell you
  whether to open a confirmation modal before calling `runProcessAction` — see
  `ProcessActions.jsx` for the reference modal.
- `getReassignees(query?)` returns candidate users for the Reassign picker.

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

    `save()` inspects this whole structure and returns `false` (setting `error`) if any
    `_root` field or any table-row field has messages. When binding a single field's error
    in the UI, read it from the shape your render layer normalises (the reference
    `src/form/index.jsx` passes each field its own `errors[fieldId]`).

    **Hidden fields are filtered out automatically.** The underlying `getValidationErrors()`
    validates every field regardless of visibility, which would otherwise block `save()` /
    `runProcessAction('submit')` on a required field the user can't even see. `useForm`
    cross-references the current `config.sections` (including per-field `IsHidden` and
    per-section `IsHidden`) and strips out errors for anything not currently visible before
    they ever reach `errors` or the has-errors check — you don't need to filter them yourself.

## Loading State

`loading` is `true` during the initial load and during `save()`. Use it to disable the form:

```javascript
<button disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
```

## Best Practices

1. **Render from `config.sections`** rather than hard-coding fields — permissions and
   visibility stay correct as rules evaluate.
2. **Respect `formPermission === 'View'`** and each field's `IsReadOnly` / `IsHidden`.
3. **Always surface validation errors** before/after `save()`.
4. **Show `loading`** to disable interaction during async work.
5. **Track `isDirty`** to warn before navigating away with unsaved changes.

## Troubleshooting

### `useForm requires (flowType, flowId) ...`

You called the hook without `flowType`/`flowId`. The legacy page-form form is gone — always
pass at least `{ flowType, flowId }`.

### `SDK not initialized`

Ensure the component is rendered inside the SDK wrapper (`window.kf` must exist). See
`src/sdk/`.

### Validation errors not updating

They refresh automatically after `updateField` / `updateFields` / `save`. No extra call needed.

### Table rows not showing

Read rows from `formData[tableId]`, not from the object returned by `getTable`.

## Support

1. Study the reference component: [`src/form/index.jsx`](./src/form/index.jsx).
2. Review the form-store validation rules.
3. Check the Kissflow SDK documentation.
