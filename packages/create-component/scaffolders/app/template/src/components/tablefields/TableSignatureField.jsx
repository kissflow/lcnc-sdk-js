import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { SignatureField } from '../fields/SignatureField.jsx'

export function TableSignatureField({ field, value, onChange, onBlur, disabled }) {
    const [open, setOpen] = useState(false)

    const handleBlur = (val) => {
        onBlur(val)
        setOpen(false)
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={disabled || field?.ReadOnly}
                className="h-8 w-full flex items-center gap-1.5 px-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {value ? (
                    <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        <span className="text-green-700 text-xs font-medium">Signed</span>
                    </>
                ) : (
                    <span className="text-gray-400 text-xs">—</span>
                )}
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base">{field.Name}</DialogTitle>
                    </DialogHeader>
                    <SignatureField
                        field={field}
                        value={value}
                        onChange={onChange}
                        onBlur={handleBlur}
                        disabled={disabled}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}
