import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTableFieldOptions } from './useTableFieldOptions.js'

export function TableMultiUserSelectField({ field, value, onChange, onBlur, disabled, getFieldOptions }) {
    const [open, setOpen] = useState(false)
    const options = useTableFieldOptions(field, getFieldOptions)

    const selected = Array.isArray(value) ? value : []
    const selectedIds = selected.map((u) => u._id || u)

    const isChecked = (user) => selectedIds.includes(user._id || user)

    const getUserLabel = (user) => user.Name || user.Email || user

    const handleToggle = (user) => {
        const next = isChecked(user)
            ? selected.filter((u) => (u._id || u) !== (user._id || user))
            : [...selected, user]
        const committed = next.length ? next : null
        onChange(committed)
        onBlur(committed)
    }

    const checkedUsers = options.filter(isChecked)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled || field.ReadOnly}
                    className="w-full min-w-[120px] h-8 flex items-center gap-1 px-2 text-sm bg-white border border-gray-200 rounded-md hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="flex-1 flex items-center gap-1 overflow-hidden min-w-0">
                        {checkedUsers.length === 0 ? (
                            <span className="text-gray-400 text-xs">—</span>
                        ) : (
                            <>
                                {checkedUsers.slice(0, 2).map((user) => (
                                    <Badge key={user._id || user} variant="secondary" className="text-xs px-1.5 py-0 h-5 shrink-0">
                                        {getUserLabel(user)}
                                    </Badge>
                                ))}
                                {checkedUsers.length > 2 && (
                                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 shrink-0">
                                        +{checkedUsers.length - 2}
                                    </Badge>
                                )}
                            </>
                        )}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="start">
                <ScrollArea className="max-h-48">
                    {options.length === 0 ? (
                        <p className="text-sm text-gray-400 py-2 px-2">No users</p>
                    ) : (
                        options.map((user) => {
                            const id = user._id || user
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => handleToggle(user)}
                                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-gray-50 cursor-pointer text-left"
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                        isChecked(user)
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'border-gray-300'
                                    }`}>
                                        {isChecked(user) && <Check className="w-2.5 h-2.5" />}
                                    </div>
                                    {getUserLabel(user)}
                                </button>
                            )
                        })
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
