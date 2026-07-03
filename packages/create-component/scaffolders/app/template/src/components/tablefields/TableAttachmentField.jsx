import { useState } from 'react'
import { Paperclip } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { AttachmentField } from '../fields/AttachmentField.jsx'

export function TableAttachmentField({ field, value, onChange, onBlur, disabled }) {
    const [open, setOpen] = useState(false)

    const files = Array.isArray(value) ? value : []
    const count = files.length

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={disabled && field.ReadOnly}
                className="flex items-center gap-1.5 h-8 px-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
                <Paperclip className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-xs">
                    {count === 0 ? 'No files' : `${count} file${count !== 1 ? 's' : ''}`}
                </span>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base">{field.Name}</DialogTitle>
                    </DialogHeader>
                    <AttachmentField
                        field={field}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}
