import { memo, useCallback, useMemo, useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";
import { getFieldComponent } from "../fields/index.js";
import { getTableFieldComponent } from "../tablefields/index.js";

function resolveFieldComponent(field) {
  return getFieldComponent(field.Type, field.Widget);
}

export function withReadOnly(field, isFormReadOnly) {
  return {
    ...field,
    ReadOnly:
      isFormReadOnly || field.IsReadOnly || field.Permission === "ReadOnly"
  };
}

// Memoised so individual field components only re-render when their own
// state (IsHidden, Required, Permission, IsReadOnly) actually changes — not
// on every keystroke in a sibling field.
export const FormField = memo(function FormFieldInner({
  field,
  isFormReadOnly,
  value,
  error,
  disabled,
  onChange,
  onBlur,
  getFieldOptions,
  parseAttachment
}) {
  const resolvedField = useMemo(
    () => withReadOnly(field, isFormReadOnly),
    [field, isFormReadOnly]
  );
  const FieldComponent = resolveFieldComponent(resolvedField);
  const handleChange = useCallback(
    (val) => onChange(field.Id, val),
    [field.Id, onChange]
  );
  const handleBlur = useCallback(
    (val) => onBlur(field.Id, val),
    [field.Id, onBlur]
  );
  return (
    <FieldComponent
      field={resolvedField}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      disabled={disabled}
      getFieldOptions={getFieldOptions}
      parseAttachment={parseAttachment}
    />
  );
});

// Memoised so individual table field components only re-render when their own
// state (IsHidden, Required, Permission, IsReadOnly) actually changes — not
// on every keystroke in a sibling field.
export const TableFieldCell = memo(function TableFieldCellInner({
  field,
  rowId,
  tableId,
  value,
  table,
  loading,
  isTableReadOnly,
  getFieldOptions,
  error
}) {
  const [localValue, setLocalValue] = useState(value ?? null);

  useEffect(
    function syncValue() {
      setLocalValue(value ?? null);
    },
    [value]
  );

  const resolvedField = useMemo(
    () => withReadOnly(field, isTableReadOnly),
    [field, isTableReadOnly]
  );

  const handleChange = (val) => setLocalValue(val);
  const handleBlur = (val) => table.updateRow(rowId, field.Id, val);

  const boundGetFieldOptions = useCallback(
    (fieldId) => getFieldOptions(fieldId, tableId, rowId),
    [getFieldOptions, tableId, rowId]
  );

  const TableComponent = getTableFieldComponent(
    resolvedField.Type,
    resolvedField.Widget
  );
  const hasError = Array.isArray(error) ? error.length > 0 : Boolean(error);

  return (
    <div>
      <TableComponent
        field={resolvedField}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={loading}
        getFieldOptions={boundGetFieldOptions}
      />
      {hasError && (
        <p className="mt-0.5 text-[10px] text-destructive leading-tight">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
});

const DEFAULT_TABLE_THEME = {
  theadClass: "bg-muted border-b border-(--color-border)",
  thClass:
    "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap min-w-[140px]",
  rowBorder: "border-b border-(--color-border) last:border-0",
  rowBase: "bg-background",
  rowAlt: "bg-muted/30",
  rowHover: "hover:bg-muted/60",
  deleteBtn:
    "p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
  wrapperClass: "overflow-x-auto"
};

// Shared child-table renderer used by every layout. Visual identity per
// layout comes from the `theme` prop (see DEFAULT_TABLE_THEME shape) rather
// than duplicating the <table> markup and TableFieldCell wiring five times.
export function SectionTable({
  section,
  columns,
  rows,
  table,
  loading,
  isTableReadOnly,
  getFieldOptions,
  tableErrors,
  theme
}) {
  const t = { ...DEFAULT_TABLE_THEME, ...theme };
  return (
    <div className={t.wrapperClass}>
      <table className="min-w-full text-sm">
        <thead className={t.theadClass}>
          <tr>
            {columns.map((col) => (
              <th key={col.Id} className={t.thClass}>
                {col.Name}
                {col.Required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </th>
            ))}
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-10 text-center text-muted-foreground text-sm"
              >
                No rows yet
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => (
              <tr
                key={row._id}
                className={`${t.rowBorder} ${rowIdx % 2 === 1 ? t.rowAlt : t.rowBase} ${t.rowHover} transition-colors`}
              >
                {columns.map((col) => (
                  <td key={col.Id} className="px-2 py-1.5">
                    <TableFieldCell
                      field={col}
                      isTableReadOnly={isTableReadOnly}
                      rowId={row._id}
                      tableId={section.Id}
                      value={row[col.Id]}
                      table={table}
                      loading={loading}
                      getFieldOptions={getFieldOptions}
                      error={tableErrors?.[row._id]?.[col.Id]}
                    />
                  </td>
                ))}
                <td className="px-3 py-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => table.deleteRow(row._id)}
                    disabled={loading || isTableReadOnly}
                    className={t.deleteBtn}
                    title="Delete row"
                  >
                    <Trash2Icon className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
