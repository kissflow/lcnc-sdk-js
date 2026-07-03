import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

export function TableNumberField({ field, value, onChange, onBlur, disabled }) {
    const [local, setLocal] = useState(value ?? '')

    useEffect(
        function syncValue() {
            setLocal(value ?? '')
        },
        [value]
    )

    const handleBlur = () => {
        const parsed = local === '' ? null : Number(local)
        onBlur(isNaN(parsed) ? null : parsed)
    }

    return (
        <Input
            type="number"
            value={local}
            onChange={(e) => {
                setLocal(e.target.value)
                onChange(e.target.value === '' ? null : Number(e.target.value))
            }}
            onBlur={handleBlur}
            disabled={disabled || field.ReadOnly}
            placeholder="—"
            className="h-8 text-sm px-2 border-transparent hover:border-gray-200 focus-visible:border-gray-300 focus-visible:ring-1 focus-visible:ring-blue-400 bg-transparent hover:bg-white focus-visible:bg-white transition-colors"
        />
    )
}
