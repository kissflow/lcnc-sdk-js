import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Styling per action role, all via theme tokens so it tracks the shadcn theme.
function actionClass(action) {
  if (action.primary)
    return "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90";
  if (action.destructive)
    return "bg-destructive/10 text-destructive hover:bg-destructive/20";
  return "bg-muted text-foreground hover:bg-muted/70";
}

const userLabel = (u) =>
  u?.Name || u?.name || u?._name || u?.label || u?._id || u?.Id;
const userId = (u) => u?._id || u?.Id || u?.id;

/**
 * Renders the workflow actions available at the current process step
 * (resolved by resolveProcessActions in useForm). Actions open a modal first
 * when they need a comment (reject / send back / withdraw), a reassignee
 * (reassign), or a confirm (discard); the rest fire immediately.
 *
 * @param {Array}    actions                 descriptors from useForm().formActions
 * @param {Array}    reassignFromCandidates  users currently assigned to this step
 *   (useForm().reassignFromCandidates) — shown read-only when there's one, or as a
 *   multi-select ("who are you reassigning away from?") when there are several.
 * @param {Function} onAction       (key, payload) => Promise<boolean>
 * @param {Function} getReassignees (query?) => Promise<user[]>
 * @param {boolean}  loading        disables buttons while an action is in flight
 * @param {boolean}  disabled       hard-disable (e.g. read-only form)
 */
export function ProcessActions({
  actions,
  reassignFromCandidates = [],
  onAction,
  getReassignees,
  loading,
  disabled
}) {
  const [pending, setPending] = useState(null); // action awaiting modal input
  const [comment, setComment] = useState("");
  const [reassignees, setReassignees] = useState([]);
  const [reassignTo, setReassignTo] = useState("");
  const [loadingReassignees, setLoadingReassignees] = useState(false);
  const [reassigneesError, setReassigneesError] = useState(null);
  const [selectedReassignFromIds, setSelectedReassignFromIds] = useState([]);

  // Load candidate assignees when a reassign modal opens.
  useEffect(() => {
    if (!pending?.requiresReassignee || !getReassignees) return;
    let active = true;
    setLoadingReassignees(true);
    setReassigneesError(null);
    Promise.resolve(getReassignees(""))
      .then((list) => active && setReassignees(list || []))
      .catch((err) => {
        if (!active) return;
        console.error("Failed to load reassignees:", err);
        setReassignees([]);
        setReassigneesError(
          err?.message || "Failed to load users to reassign to."
        );
      })
      .finally(() => active && setLoadingReassignees(false));
    return () => {
      active = false;
    };
  }, [pending, getReassignees]);

  if (!actions || actions.length === 0) return null;

  const closeModal = () => {
    setPending(null);
    setComment("");
    setReassignTo("");
    setReassignees([]);
    setReassigneesError(null);
    setSelectedReassignFromIds([]);
  };

  const handleClick = (action) => {
    if (action.requiresComment || action.confirm || action.requiresReassignee) {
      setComment("");
      setReassignTo("");
      setSelectedReassignFromIds([]);
      setPending(action);
    } else {
      onAction(action.key);
    }
  };

  const toggleReassignFrom = (id) => {
    setSelectedReassignFromIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    const action = pending;
    const payload = {};
    if (action.requiresComment) payload.comment = comment;
    if (action.requiresReassignee) {
      payload.reassignTo = reassignees.find((u) => userId(u) === reassignTo);
      // Mirrors the native reassign hook: an explicit selection wins,
      // otherwise reassign away from every current assignee on the step.
      payload.reassignedFrom = selectedReassignFromIds.length
        ? reassignFromCandidates.filter((u) =>
            selectedReassignFromIds.includes(userId(u))
          )
        : reassignFromCandidates;
    }
    const ok = await onAction(action.key, payload);
    if (ok !== false) closeModal();
  };

  const needsComment = pending?.requiresComment;
  const needsReassignee = pending?.requiresReassignee;
  const confirmDisabled =
    loading ||
    (needsComment && !comment.trim()) ||
    (needsReassignee && !reassignTo);

  return (
    <>
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => handleClick(action)}
            disabled={loading || disabled}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${actionClass(action)}`}
          >
            {loading && action.primary && (
              <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
            )}
            {action.label}
          </button>
        ))}
      </div>

      <Dialog open={!!pending} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pending?.label}</DialogTitle>
            <DialogDescription>
              {needsReassignee
                ? "Choose who to reassign this task to and add a comment."
                : needsComment
                  ? "Add a comment for this action."
                  : `Are you sure you want to ${pending?.label.toLowerCase()} this item? This cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          {needsReassignee && reassignFromCandidates.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">
                Currently assigned to
              </p>
              {reassignFromCandidates.length === 1 ? (
                <p className="text-sm text-muted-foreground">
                  {userLabel(reassignFromCandidates[0])}
                </p>
              ) : (
                <div className="space-y-2">
                  {reassignFromCandidates.map((u) => (
                    <label
                      key={userId(u)}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedReassignFromIds.includes(userId(u))}
                        onCheckedChange={() => toggleReassignFrom(userId(u))}
                      />
                      {userLabel(u)}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {needsReassignee && (
            <Select
              value={reassignTo}
              onValueChange={setReassignTo}
              disabled={loadingReassignees}
            >
              <SelectTrigger autoFocus className="w-full">
                <SelectValue
                  placeholder={
                    loadingReassignees ? "Loading…" : "Select a user…"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {reassignees.map((u) => (
                  <SelectItem key={userId(u)} value={userId(u)}>
                    {userLabel(u)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {needsReassignee && reassigneesError && (
            <p className="text-sm text-destructive">{reassigneesError}</p>
          )}

          {needsReassignee &&
            !loadingReassignees &&
            !reassigneesError &&
            reassignees.length === 0 && (
              <p className="text-sm rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800">
                Reassignment is unavailable for this step as it has fixed
                assignees.
              </p>
            )}

          {needsComment && (
            <textarea
              autoFocus={!needsReassignee}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Enter a comment…"
              className="w-full text-sm border border-input rounded-md bg-background px-3 py-2 placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors resize-none"
            />
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted disabled:opacity-40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={confirmDisabled}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${actionClass(pending || {})}`}
            >
              {loading && <Loader2Icon className="w-3.5 h-3.5 animate-spin" />}
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
