export function TableSequenceNumberField({ value }) {
    return (
        <span className="flex items-center h-8 px-2 text-sm text-gray-500 select-none">
            {value ?? '—'}
        </span>
    )
}
