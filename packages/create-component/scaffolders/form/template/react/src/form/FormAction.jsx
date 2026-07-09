import { Loader2Icon } from 'lucide-react'
import { ProcessActions } from './ProcessActions.jsx'

/* ─────────────────────────────────────────────────────────────────────────────
   FORM ACTION  —  Sticky bottom bar: Reset + Save/Submit or workflow actions
───────────────────────────────────────────────────────────────────────────── */

export function FormAction({
    flowType,
    formActions,
    onAction,
    onSave,
    onReset,
    getReassignees,
    loading,
    isDirty,
    isNewRecord,
    isFormReadOnly,
}) {
    return (
        <div className="sticky bottom-0 z-20 bg-background/90 backdrop-blur-sm border-t border-[--color-border]">
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={onReset}
                    disabled={loading || !isDirty || isFormReadOnly}
                    className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Reset
                </button>
                {flowType === 'process' && formActions?.length > 0 ? (
                    // Process forms replace the generic Save with the
                    // workflow actions available at the current step.
                    <ProcessActions
                        actions={formActions}
                        onAction={onAction}
                        onSave={onSave}
                        getReassignees={getReassignees}
                        loading={loading}
                        disabled={isFormReadOnly}
                    />
                ) : (
                    <button
                        type="submit"
                        disabled={loading || !isDirty || isFormReadOnly}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                            loading || !isDirty || isFormReadOnly
                                ? 'bg-muted text-muted-foreground shadow-none cursor-not-allowed'
                                : 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                                {isNewRecord
                                    ? 'Submitting…'
                                    : 'Saving…'}
                            </>
                        ) : isNewRecord ? (
                            'Submit'
                        ) : (
                            'Save'
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}
