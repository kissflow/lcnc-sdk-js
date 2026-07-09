import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

export function TableTextField({ field, value, onChange, onBlur, disabled }) {
    const [local, setLocal] = useState(value ?? '')

    useEffect(
        function syncValue() {
            setLocal(value ?? '')
        },
        [value]
    )

    return (
        <Input
            type="text"
            value={local}
            onChange={(e) => {
                setLocal(e.target.value)
                onChange(e.target.value)
            }}
            onBlur={() => onBlur(local || null)}
            disabled={disabled || field.ReadOnly}
            placeholder="—"
            className="h-8 text-sm px-2 border-transparent hover:border-border focus-visible:border-input focus-visible:ring-1 focus-visible:ring-ring bg-transparent hover:bg-background focus-visible:bg-background transition-colors"
        />
    )
}
