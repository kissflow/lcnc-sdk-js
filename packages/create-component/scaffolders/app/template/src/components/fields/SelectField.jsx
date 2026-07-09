import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'

export function SelectField({
    field,
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    getFieldOptions,
}) {
    const [fieldOptions, setFieldOptions] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true)
            try {
                const fetchedOptions = await getFieldOptions(field.Id)
                setFieldOptions(fetchedOptions)
            } catch (err) {
                console.error(`Failed to fetch options for ${field.Name}:`, err)
            } finally {
                setLoading(false)
            }
        }

        fetchOptions()
    }, [])

    const handleChange = (selectedValue) => {
        if (!selectedValue) return
        onChange(selectedValue)
        onBlur(selectedValue)
    }

    return (
        <div className="space-y-2">
            <label
                htmlFor={field.Id}
                className="block text-sm font-semibold text-gray-700"
            >
                {field.Name}
                {field.Required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
                value={value || ''}
                onValueChange={handleChange}
                disabled={disabled || field.ReadOnly || loading}
            >
                <SelectTrigger
                    id={field.Id}
                    className={error ? 'border-red-300 bg-red-50' : ''}
                >
                    <SelectValue
                        placeholder={`Select ${field.Name.toLowerCase()}`}
                    />
                </SelectTrigger>
                <SelectContent>
                    {fieldOptions.map((option) => (
                        <SelectItem
                            key={option._id || option.name || option}
                            value={option._id || option.name || option}
                        >
                            {option.Name || option.name || option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    )
}
