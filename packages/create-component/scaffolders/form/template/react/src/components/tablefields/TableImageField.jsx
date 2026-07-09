import { useState, useEffect } from 'react'
import { ImageIcon, Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ImageField } from '../fields/ImageField.jsx'

export function TableImageField({ field, value, onChange, onBlur, disabled }) {
    const [open, setOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [resolving, setResolving] = useState(false)

    useEffect(
        function resolvePreview() {
            if (!value?.key) {
                setPreviewUrl(null)
                return
            }
            let cancelled = false
            setResolving(true)
            window.kf.client
                .getImageUrl(value)
                .then((url) => {
                    if (!cancelled) setPreviewUrl(url)
                })
                .catch(() => {
                    if (!cancelled) setPreviewUrl(null)
                })
                .finally(() => {
                    if (!cancelled) setResolving(false)
                })
            return function cleanup() {
                cancelled = true
            }
        },
        [value?.key]
    )

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center justify-center h-8 w-full px-2 overflow-hidden"
            >
                {resolving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={value?.name || field.Name}
                        className="h-7 w-7 object-cover rounded"
                    />
                ) : (
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-base">{field.Name}</DialogTitle>
                    </DialogHeader>
                    <ImageField
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
