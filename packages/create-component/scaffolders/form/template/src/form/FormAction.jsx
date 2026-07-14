import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProcessActions } from "./ProcessActions.jsx";

/* ─────────────────────────────────────────────────────────────────────────────
   FORM ACTION  —  Sticky bottom bar: lifecycle actions only (no generic Save —
   every flow type autosaves per field; see FormHeader for the saving status).
   Renders nothing once there's no action left to take (existing dataform/
   board record, or a process step with no available actions).
───────────────────────────────────────────────────────────────────────────── */

export function FormAction({
  flowType,
  formActions,
  reassignFromCandidates,
  onAction,
  getReassignees,
  loading,
  isNewRecord,
  isFormReadOnly
}) {
  const isProcess = flowType === "process";
  const hasProcessActions = isProcess && formActions?.length > 0;
  const showDraftActions = !isProcess && isNewRecord;
  const hasActions = hasProcessActions || showDraftActions;

  // isNewRecord/formActions only resolve partway through the initial load
  // (they depend on the initForm() round-trip finishing) — without this,
  // the whole bar would pop in only once that resolves. Show a placeholder
  // for the gap instead of nothing.
  if (loading && !hasActions) {
    return (
      <div className="sticky bottom-0 z-20 bg-background/90 backdrop-blur-sm border-t border-(--color-border)">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-end gap-2">
          <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!hasActions) return null;

  return (
    <div className="sticky bottom-0 z-20 bg-background/90 backdrop-blur-sm border-t border-(--color-border)">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-end gap-2">
        {hasProcessActions ? (
          <ProcessActions
            actions={formActions}
            reassignFromCandidates={reassignFromCandidates}
            onAction={onAction}
            getReassignees={getReassignees}
            loading={loading}
            disabled={isFormReadOnly}
          />
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onAction("discard")}
              disabled={loading || isFormReadOnly}
            >
              Discard
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onAction("submit")}
              disabled={loading || isFormReadOnly}
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
