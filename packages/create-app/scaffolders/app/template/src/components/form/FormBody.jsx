import { Loader2Icon, PlusIcon } from "lucide-react";
import { FormField, SectionTable } from "./shared.jsx";

/* ─────────────────────────────────────────────────────────────────────────────
   FORM BODY  —  Error banner + the form card (sections, fields, child
   tables, validation-error summary)
───────────────────────────────────────────────────────────────────────────── */

export function FormBody({
  sections,
  localState,
  errors,
  loading,
  error,
  isFormReadOnly,
  onFieldChange,
  onFieldBlur,
  getFieldOptions,
  parseAttachment,
  getTable
}) {
  const rootErrorCount = Object.keys(errors?.["_root"] || {}).length;
  const tableErrorCount = Object.entries(errors || {})
    .filter(([k]) => k !== "_root")
    .reduce(
      (n, [, rows]) =>
        n +
        Object.values(rows || {}).reduce(
          (m, fields) => m + Object.keys(fields || {}).length,
          0
        ),
      0
    );
  const totalErrorCount = rootErrorCount + tableErrorCount;
  const hasErrors = totalErrorCount > 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-2">
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/40 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* ── Form card ──────────────────────────────────────── */}
      <div className="bg-background rounded-xl border border-(--color-border) shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <Loader2Icon className="w-7 h-7 text-(--color-primary) animate-spin" />
            <p className="text-sm text-muted-foreground">Loading form…</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
            <p className="text-sm">No fields available</p>
          </div>
        ) : (
          <div>
            {sections.map((section, sectionIdx) => {
              if (section.Type === "Section") {
                return (
                  <div
                    key={section.Id}
                    className={`px-8 py-6 ${sectionIdx > 0 ? "border-t border-(--color-border)" : ""}`}
                  >
                    {section.Name && (
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-0.5 h-4 rounded-full bg-(--color-primary) shrink-0" />
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                          {section.Name}
                        </h2>
                      </div>
                    )}
                    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                      {(section.Fields || [])
                        .filter((field) => !field.IsHidden)
                        .map((field) => (
                          <FormField
                            key={field.Id}
                            field={field}
                            isFormReadOnly={isFormReadOnly}
                            value={localState[field.Id]}
                            onChange={onFieldChange}
                            onBlur={onFieldBlur}
                            error={errors["_root"]?.[field.Id]}
                            disabled={loading}
                            getFieldOptions={getFieldOptions}
                            parseAttachment={parseAttachment}
                          />
                        ))}
                    </div>
                  </div>
                );
              }

              if (section.Type === "Model") {
                const table = getTable(section.Id);
                const columns = (section.Fields || []).filter(
                  (col) => !col.IsHidden
                );
                const isTableReadOnly =
                  isFormReadOnly || section.Permission === "ReadOnly";
                const rows = localState[`Table::${section.Id}`] || [];

                return (
                  <div
                    key={section.Id}
                    className={`${sectionIdx > 0 ? "border-t border-(--color-border)" : ""}`}
                  >
                    <div className="px-8 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-0.5 h-4 rounded-full bg-(--color-primary) shrink-0" />
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                          {section.Name}
                        </h2>
                        {rows.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            {rows.length}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => table.addRow({})}
                        disabled={loading || isTableReadOnly}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Add Row
                      </button>
                    </div>

                    <div className="border-t border-(--color-border)">
                      <SectionTable
                        section={section}
                        columns={columns}
                        rows={rows}
                        table={table}
                        loading={loading}
                        isTableReadOnly={isTableReadOnly}
                        getFieldOptions={getFieldOptions}
                        tableErrors={errors?.[section.Id]}
                      />
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {hasErrors && (
              <div className="px-8 py-4 border-t border-destructive/30 bg-destructive/10">
                <p className="text-xs text-destructive font-medium">
                  {totalErrorCount} validation error(s) — review fields above.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
