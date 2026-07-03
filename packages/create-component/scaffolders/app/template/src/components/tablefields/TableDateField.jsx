import { Input } from '@/components/ui/input'

export function TableDateField({ field, value, onChange, onBlur, disabled }) {
    const display = value ? String(value).split('T')[0] : ''

    return (
        <Input
            type="date"
            value={display}
            onChange={(e) => onChange(e.target.value || null)}
            onBlur={(e) => onBlur(e.target.value || null)}
            disabled={disabled || field.ReadOnly}
            className="h-8 text-sm px-2 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-400 bg-white"
        />
    )
}
