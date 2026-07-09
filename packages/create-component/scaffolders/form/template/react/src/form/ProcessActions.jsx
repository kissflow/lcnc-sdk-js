import { useEffect, useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Styling per action role, all via theme tokens so it tracks the shadcn theme.
function actionClass(action) {
    if (action.primary)
        return 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
    if (action.destructive)
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20'
    return 'bg-muted text-foreground hover:bg-muted/70'
}

const userLabel = (u) => u?.Name || u?.name || u?._name || u?.label || u?._id || u?.Id
const userId = (u) => u?._id || u?.Id || u?.id

/**
 * Renders the workflow actions available at the current process step
 * (resolved by resolveProcessActions in useForm). Actions open a modal first
 * when they need a comment (reject / send back / withdraw), a reassignee
 * (reassign), or a confirm (discard); the rest fire immediately. The plain
 * `save` action is routed to onSave rather than a workflow transition.
 *
 * @param {Array}    actions        descriptors from useForm().formActions
 * @param {Function} onAction       (key, payload) => Promise<boolean>
 * @param {Function} onSave         () => Promise<boolean>  (for the Save action)
 * @param {Function} getReassignees (query?) => Promise<user[]>
 * @param {boolean}  loading        disables buttons while an action is in flight
 * @param {boolean}  disabled       hard-disable (e.g. read-only form)
 */
export function ProcessActions({
    actions,
    onAction,
    onSave,
    getReassignees,
    loading,
    disabled,
}) {
    const [pending, setPending] = useState(null) // action awaiting modal input
    const [comment, setComment] = useState('')
    const [reassignees, setReassignees] = useState([])
    const [reassignTo, setReassignTo] = useState('')
    const [loadingReassignees, setLoadingReassignees] = useState(false)

    // Load candidate assignees when a reassign modal opens.
    useEffect(() => {
        if (!pending?.requiresReassignee || !getReassignees) return
        let active = true
        setLoadingReassignees(true)
        Promise.resolve(getReassignees(''))
            .then((list) => active && setReassignees(list || []))
            .catch(() => active && setReassignees([]))
            .finally(() => active && setLoadingReassignees(false))
        return () => {
            active = false
        }
    }, [pending, getReassignees])

    if (!actions || actions.length === 0) return null

    const closeModal = () => {
        setPending(null)
        setComment('')
        setReassignTo('')
        setReassignees([])
    }

    const handleClick = (action) => {
        if (action.isSave) {
            onSave()
        } else if (
            action.requiresComment ||
            action.confirm ||
            action.requiresReassignee
        ) {
            setComment('')
            setReassignTo('')
            setPending(action)
        } else {
            onAction(action.key)
        }
    }

    const handleConfirm = async () => {
        const action = pending
        const payload = {}
        if (action.requiresComment) payload.comment = comment
        if (action.requiresReassignee) {
            payload.reassignTo = reassignees.find(
                (u) => userId(u) === reassignTo
            )
        }
        const ok = await onAction(action.key, payload)
        if (ok !== false) closeModal()
    }

    const needsComment = pending?.requiresComment
    const needsReassignee = pending?.requiresReassignee
    const confirmDisabled =
        loading ||
        (needsComment && !comment.trim()) ||
        (needsReassignee && !reassignTo)

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
                                ? 'Choose who to reassign this task to and add a comment.'
                                : needsComment
                                  ? 'Add a comment for this action.'
                                  : `Are you sure you want to ${pending?.label.toLowerCase()} this item? This cannot be undone.`}
                        </DialogDescription>
                    </DialogHeader>

                    {needsReassignee && (
                        <select
                            autoFocus
                            value={reassignTo}
                            onChange={(e) => setReassignTo(e.target.value)}
                            className="w-full text-sm border border-input rounded-md bg-background px-3 py-2 focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
                        >
                            <option value="" disabled>
                                {loadingReassignees
                                    ? 'Loading…'
                                    : 'Select a user…'}
                            </option>
                            {reassignees.map((u) => (
                                <option key={userId(u)} value={userId(u)}>
                                    {userLabel(u)}
                                </option>
                            ))}
                        </select>
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
    )
}
