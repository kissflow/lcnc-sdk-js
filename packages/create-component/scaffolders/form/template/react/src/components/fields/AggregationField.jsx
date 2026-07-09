import { Input } from '@/components/ui/input'

const formatValue = (type, value) => {
    if (value === null || value === undefined || value === '') return ''

    if (type === 'Date') return String(value).split('T')[0]
    if (type === 'DateTime') return String(value).slice(0, 16)
    return String(value)
}

const inputType = (type) => {
    if (type === 'Number' || type === 'Currency') return 'text'
    if (type === 'Date') return 'date'
    if (type === 'DateTime') return 'datetime-local'
    return 'text'
}

export function AggregationField({ field, value }) {
    const isCurrency = field.Type === 'Currency'

    return (
        <div className="space-y-2">
            <label htmlFor={field.Id} className="block text-sm font-semibold text-foreground">
                {field.Name}
                {field.Required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="relative">
                {isCurrency && (
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                )}
                <Input
                    id={field.Id}
                    type={inputType(field.Type)}
                    name={field.Id}
                    value={formatValue(field.Type, value)}
                    readOnly
                    className={`bg-muted cursor-default ${isCurrency ? 'pl-8' : ''}`}
                />
            </div>
        </div>
    )
}
