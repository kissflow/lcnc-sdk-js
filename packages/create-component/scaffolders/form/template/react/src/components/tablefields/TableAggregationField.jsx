const formatValue = (type, value) => {
    if (value === null || value === undefined || value === '') return '—'
    if (type === 'Date') return String(value).split('T')[0]
    if (type === 'DateTime') return String(value).slice(0, 16)
    return String(value)
}

export function TableAggregationField({ field, value }) {
    return (
        <span className="flex items-center h-8 px-2 text-sm text-muted-foreground select-none">
            {formatValue(field.Type, value)}
        </span>
    )
}
