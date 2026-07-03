import { useState, useEffect } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

const userId = (user) => user?._id || user
const userLabel = (user) => user?.Name || user?.name || user?.Email || user

export function MultiUserSelectField({ field, value, onChange, onBlur, error, disabled = false, getFieldOptions }) {
    const [open, setOpen] = useState(false)
    const [fieldOptions, setFieldOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const selectedUsers = Array.isArray(value) ? value : []
    const readOnly = disabled || field.ReadOnly

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true)
            try {
                const fetchedOptions = await getFieldOptions(field.Id)
                setFieldOptions(Array.isArray(fetchedOptions) ? fetchedOptions : [])
            } catch (err) {
                console.error(`Failed to fetch options for ${field.Name}:`, err)
            } finally {
                setLoading(false)
            }
        }

        fetchOptions()
    }, [])

    const isSelected = (user) => selectedUsers.some((selected) => userId(selected) === userId(user))

    const commit = (next) => {
        const updated = next.length ? next : null
        onChange(updated)
        onBlur(updated)
    }

    const handleToggle = (user) => {
        commit(
            isSelected(user)
                ? selectedUsers.filter((selected) => userId(selected) !== userId(user))
                : [...selectedUsers, user]
        )
    }

    const handleRemove = (e, user) => {
        e.stopPropagation()
        commit(selectedUsers.filter((selected) => userId(selected) !== userId(user)))
    }

    return (
        <div className="min-w-0 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                {field.Name}
                {field.Required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={readOnly || loading}
                        className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        } ${readOnly ? 'bg-gray-50' : 'bg-white cursor-pointer hover:border-gray-400'}`}
                    >
                        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                            {loading ? (
                                <span className="text-sm text-gray-400">Loading…</span>
                            ) : selectedUsers.length === 0 ? (
                                <span className="text-sm text-gray-400">
                                    Select {field.Name.toLowerCase()}…
                                </span>
                            ) : (
                                selectedUsers.map((user) => (
                                    <Badge key={userId(user)} variant="secondary" className="gap-1 pr-1">
                                        <span className="max-w-[140px] truncate">
                                            {userLabel(user)}
                                        </span>
                                        {!readOnly && (
                                            <span
                                                role="button"
                                                onClick={(e) => handleRemove(e, user)}
                                                className="rounded-full p-0.5 hover:bg-black/10"
                                                aria-label={`Remove ${userLabel(user)}`}
                                            >
                                                <X className="w-3 h-3" />
                                            </span>
                                        )}
                                    </Badge>
                                ))
                            )}
                        </span>
                        <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-1" align="start">
                    <ScrollArea className="max-h-56">
                        {fieldOptions.length === 0 ? (
                            <p className="px-2 py-2 text-sm text-gray-400">
                                No users available
                            </p>
                        ) : (
                            fieldOptions.map((user) => {
                                const id = userId(user)
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => handleToggle(user)}
                                        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-50"
                                    >
                                        <div
                                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                                isSelected(user)
                                                    ? 'border-blue-500 bg-blue-500 text-white'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            {isSelected(user) && <Check className="w-2.5 h-2.5" />}
                                        </div>
                                        {userLabel(user)}
                                    </button>
                                )
                            })
                        )}
                    </ScrollArea>
                </PopoverContent>
            </Popover>
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
