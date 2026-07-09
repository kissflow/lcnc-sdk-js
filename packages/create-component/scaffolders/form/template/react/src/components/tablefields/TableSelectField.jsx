import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useTableFieldOptions } from './useTableFieldOptions.js'

export function TableSelectField({ field, value, onChange, onBlur, disabled, getFieldOptions }) {
    const options = useTableFieldOptions(field, getFieldOptions)

    const handleChange = (selected) => {
        if (!selected) return
        onChange(selected)
        onBlur(selected)
    }

    return (
        <Select
            value={value || ''}
            onValueChange={handleChange}
            disabled={disabled || field.ReadOnly}
        >
            <SelectTrigger className="h-8 text-sm px-2 border-border bg-background focus:ring-1 focus:ring-ring w-full min-w-[100px]">
                <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem
                        key={option._id || option.name || option}
                        value={option._id || option.name || option}
                    >
                        {option.Name || option.name || option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
