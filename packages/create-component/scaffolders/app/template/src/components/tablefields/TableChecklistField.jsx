import { useState } from 'react'
import { ListChecks } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChecklistField } from '../fields/ChecklistField.jsx'

export function TableChecklistField({ field, value, onChange, onBlur, disabled }) {
    const [open, setOpen] = useState(false)

    const items = Array.isArray(value) ? value : []
    const total = items.length
    const checked = items.filter((i) => i.selected).length

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled || field.ReadOnly}
                    className="flex items-center gap-1.5 h-8 px-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                    <ListChecks className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs">
                        {total === 0 ? 'No items' : `${checked} / ${total}`}
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="start">
                <ChecklistField
                    field={field}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                />
            </PopoverContent>
        </Popover>
    )
}
