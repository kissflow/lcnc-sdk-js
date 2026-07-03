import { useState, useEffect } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function RadioField({ field, value, onChange, onBlur, error, disabled = false, getFieldOptions }) {
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
        onChange(selectedValue)
        onBlur(selectedValue)
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                {field.Name}
                {field.Required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2 border border-gray-300 rounded-lg p-3">
                {loading ? (
                    <p className="text-sm text-gray-500">Loading options...</p>
                ) : fieldOptions.length > 0 ? (
                    <RadioGroup value={value || ''} onValueChange={handleChange} disabled={disabled || field.ReadOnly}>
                        {fieldOptions.map((option) => {
                            const optionId = option._id || option.name || option
                            const optionLabel = option.Name || option.name || option
                            return (
                                <div key={optionId} className="flex items-center gap-2">
                                    <RadioGroupItem value={optionId} id={`${field.Id}-${optionId}`} disabled={disabled || field.ReadOnly} />
                                    <label
                                        htmlFor={`${field.Id}-${optionId}`}
                                        className="text-sm cursor-pointer"
                                    >
                                        {optionLabel}
                                    </label>
                                </div>
                            )
                        })}
                    </RadioGroup>
                ) : (
                    <p className="text-sm text-gray-500">No options available</p>
                )}
            </div>
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
