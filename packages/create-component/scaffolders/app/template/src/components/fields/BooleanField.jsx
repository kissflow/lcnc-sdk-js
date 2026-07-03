import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function BooleanField({ field, value, onChange, onBlur, error, disabled = false }) {
    const handleChange = (val) => {
        const boolValue = val === 'true'
        onChange(boolValue)
        onBlur(boolValue)
    }

    return (
        <div className="space-y-2">
            <label htmlFor={field.Id} className="block text-sm font-semibold text-gray-700">
                {field.Name}
                {field.Required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
                value={value ? 'true' : 'false'}
                onValueChange={handleChange}
                disabled={disabled || field.ReadOnly}
            >
                <SelectTrigger
                    id={field.Id}
                    className={error ? 'border-red-300 bg-red-50' : ''}
                >
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                </SelectContent>
            </Select>
            {error && (
                <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                    </svg>
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    )
}
