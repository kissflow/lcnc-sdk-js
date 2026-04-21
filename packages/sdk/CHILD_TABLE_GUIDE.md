# Child Table Guide — useForm Hook

Kissflow forms are structured as **Form → Sections → (Fields | Table)**. A form can have multiple sections, each being either regular fields or a child table with its own columns and rows.

`useForm` exposes two new returns to handle this dynamically:
- **`config`** — pure schema describing sections, field types, and table columns
- **`getTable(tableId)`** — CRUD operations for a table, with a reactive `rows` property

---

## `config` Schema

`config.sections` is an ordered array matching the form's section layout.

### Field section

```js
{
  type: 'field',
  fieldId: string,      // e.g. "First_Name"
  label: string,        // e.g. "First Name"
  fieldType: string,    // e.g. "Text", "Number", "Date", "Dropdown"
  required: boolean
}
```

### Table section

```js
{
  type: 'table',
  tableId: string,      // e.g. "Employees_Table"
  label: string,        // e.g. "Employees"
  columns: [
    { fieldId: string, label: string, fieldType: string }
  ]
}
```

---

## `getTable(tableId)` API

Call `getTable(tableId)` with the `tableId` from a table section. Returns a memoized object — safe to call in render.

| Property / Method | Type | Description |
|---|---|---|
| `rows` | `object[]` | Current row data — always fresh, updates after every mutation |
| `addRow(rowData)` | `Promise` | Add one row, then refresh rows |
| `addRows(rows[])` | `Promise` | Bulk add rows |
| `deleteRow(rowId)` | `Promise` | Delete one row by `_id` |
| `deleteRows(rowIds[])` | `Promise` | Bulk delete |
| `updateRow(rowId, fieldId, value)` | `Promise` | Update a specific field in a row |
| `getRowField(rowId, fieldId)` | `Promise<any>` | Get a specific field value from a row |
| `getSelectedRows()` | `Promise<object[]>` | Get rows currently selected in the platform table UI |

---

## Example 1: Render Full Form Dynamically

One `config.sections.map()` handles both fields and all tables — no hardcoding needed.

```jsx
import { useForm } from './hooks';

export function DynamicForm({ flowType, flowId, instanceId }) {
  const { formData, config, updateField, getTable, loading } = useForm(flowType, flowId, instanceId);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {config.sections.map(section => {
        if (section.type === 'field') {
          return (
            <div key={section.fieldId}>
              <label>{section.label}{section.required && ' *'}</label>
              <input
                value={formData[section.fieldId] || ''}
                onChange={e => updateField(section.fieldId, e.target.value)}
              />
            </div>
          );
        }

        if (section.type === 'table') {
          const table = getTable(section.tableId);
          return (
            <div key={section.tableId}>
              <h3>{section.label}</h3>
              <table>
                <thead>
                  <tr>
                    {section.columns.map(col => <th key={col.fieldId}>{col.label}</th>)}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map(row => (
                    <tr key={row._id}>
                      {section.columns.map(col => (
                        <td key={col.fieldId}>
                          <input
                            value={row[col.fieldId] || ''}
                            onChange={e => table.updateRow(row._id, col.fieldId, e.target.value)}
                          />
                        </td>
                      ))}
                      <td>
                        <button onClick={() => table.deleteRow(row._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => table.addRow({})}>+ Add Row</button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
```

---

## Example 2: Render Only Tables

```jsx
const { config, getTable } = useForm("dataform", "EmpMaster", "emp_123");

const tableSections = config.sections.filter(s => s.type === 'table');

tableSections.map(section => {
  const table = getTable(section.tableId);
  return (
    <div key={section.tableId}>
      <h3>{section.label} ({table.rows.length} rows)</h3>
      {/* render table */}
    </div>
  );
});
```

---

## Example 3: Add and Delete Rows

```jsx
const { config, getTable } = useForm("dataform", "EmpMaster", "emp_123");
const table = getTable("Employees_Table");

// Add a row with initial values
await table.addRow({ Name: "John", Email: "john@example.com" });

// Add multiple rows at once
await table.addRows([
  { Name: "Jane", Email: "jane@example.com" },
  { Name: "Bob",  Email: "bob@example.com" },
]);

// Delete a specific row
await table.deleteRow(row._id);

// Delete multiple rows
await table.deleteRows(selectedRows.map(r => r._id));
```

---

## Example 4: Inline Row Field Editing

```jsx
const table = getTable("Employees_Table");

table.rows.map(row => (
  <tr key={row._id}>
    <td>
      <input
        defaultValue={row.Name}
        onBlur={e => table.updateRow(row._id, "Name", e.target.value)}
      />
    </td>
    <td>
      <input
        defaultValue={row.Email}
        onBlur={e => table.updateRow(row._id, "Email", e.target.value)}
      />
    </td>
  </tr>
))
```

---

## Example 5: Access a Specific Table by ID

```jsx
const { config, getTable } = useForm("dataform", "EmpMaster", "emp_123");

// Find the table section's schema
const employeesSection = config.sections.find(s => s.tableId === "Employees_Table");

// Get table ops
const employeesTable = getTable("Employees_Table");

console.log(employeesSection.columns);  // column definitions
console.log(employeesTable.rows);       // current rows
```

---

## Notes

- `getTable(tableId)` is memoized — calling it multiple times with the same `tableId` returns the same object reference. Safe to call in render.
- `table.rows` always reflects the latest data. No need to read from `formData[tableId]`.
- Every mutation (`addRow`, `deleteRow`, `updateRow`, etc.) automatically refreshes `rows`.
- `tableId` is the field ID of the table section, visible in the Kissflow form builder.
