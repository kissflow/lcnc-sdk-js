import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useTableFieldOptions } from './useTableFieldOptions.js'

export function TableUserSelectField({ field, value, onChange, onBlur, disabled, getFieldOptions }) {
    const options = useTableFieldOptions(field, getFieldOptions)

    const currentId = value?._id || value || ''

    const handleChange = (selectedId) => {
        if (!selectedId) return
        const user = options.find((u) => (u._id || u) === selectedId) || selectedId
        onChange(user)
        onBlur(user)
    }

    return (
        <Select
            value={currentId}
            onValueChange={handleChange}
            disabled={disabled || field.ReadOnly}
        >
            <SelectTrigger className="h-8 text-sm px-2 border-gray-200 bg-white focus:ring-1 focus:ring-blue-400 w-full min-w-[120px]">
                <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
                {options.map((user) => {
                    const id = user._id || user
                    const label = user.Name || user.Email || user
                    return (
                        <SelectItem key={id} value={id}>
                            {label}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
