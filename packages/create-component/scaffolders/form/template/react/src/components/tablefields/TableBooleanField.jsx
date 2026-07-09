import { Switch } from '@/components/ui/switch'

export function TableBooleanField({ field, value, onChange, onBlur, disabled }) {
    const checked = Boolean(value)

    const handleChange = (next) => {
        onChange(next)
        onBlur(next)
    }

    return (
        <div className="flex items-center justify-center h-8">
            <Switch
                checked={checked}
                onCheckedChange={handleChange}
                disabled={disabled || field.ReadOnly}
            />
        </div>
    )
}
