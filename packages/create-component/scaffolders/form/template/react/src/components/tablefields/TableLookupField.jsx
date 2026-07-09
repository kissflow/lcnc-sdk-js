import { useState, useCallback, useRef, useEffect } from 'react'
import { Search, X, ChevronDown, Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    RecordCard,
    formatFieldValue,
} from '../fields/LookupField.jsx'

export function TableLookupField({ field, value, onChange, onBlur, disabled, getFieldOptions }) {
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const searchRef = useRef(null)

    const readOnly = disabled || field.ReadOnly
    const columns = field.LookupColumns || []
    const headerKey = field.LookupConfigurations?.SelectedHeaderField?.Id

    const loadOptions = useCallback(
        async function fetchOptions() {
            setLoading(true)
            try {
                const opts = await getFieldOptions(field.Id)
                setOptions(Array.isArray(opts) ? opts : [])
            } catch {
                setOptions([])
            } finally {
                setLoading(false)
            }
        },
        [field.Id, getFieldOptions]
    )

    useEffect(
        function openEffect() {
            if (open) {
                loadOptions()
                setTimeout(() => searchRef.current?.focus(), 80)
            } else {
                setSearch('')
            }
        },
        [open, loadOptions]
    )

    const filtered = search.trim()
        ? options.filter((r) =>
              Object.values(r).some((v) =>
                  formatFieldValue(v).toLowerCase().includes(search.toLowerCase())
              )
          )
        : options

    const handleSelect = (record) => {
        onChange(record)
        onBlur(record)
        setOpen(false)
    }

    const handleClear = (e) => {
        e.stopPropagation()
        onChange(null)
        onBlur(null)
    }

    const titleKey = headerKey || 'Name'
    const displayTitle = value ? (value[titleKey] ?? value.Name ?? value._id) : null

    return (
        <>
            <button
                type="button"
                onClick={() => !readOnly && setOpen(true)}
                disabled={readOnly}
                className="flex items-center gap-1.5 h-8 px-2 w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {displayTitle ? (
                    <>
                        <span className="flex-1 truncate text-left text-foreground text-xs">
                            {String(displayTitle)}
                        </span>
                        {!readOnly && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="shrink-0 text-muted-foreground hover:text-muted-foreground cursor-pointer"
                                aria-label="Clear"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <span className="flex-1 text-muted-foreground text-xs">—</span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    </>
                )}
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                    <DialogHeader className="px-4 pt-4 pb-3 border-b border-border">
                        <DialogTitle className="text-base font-semibold">
                            {field.Name}
                        </DialogTitle>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search…"
                                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-muted placeholder-muted-foreground focus:outline-none focus:border-ring focus:bg-background focus:ring-1 focus:ring-ring transition-colors"
                            />
                        </div>
                    </DialogHeader>

                    <ScrollArea className="max-h-[420px]">
                        <div className="p-3 space-y-2">
                            {loading ? (
                                <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Loading…</span>
                                </div>
                            ) : filtered.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-10">
                                    {search ? 'No results match your search' : 'No options available'}
                                </p>
                            ) : (
                                filtered.map((record) => (
                                    <RecordCard
                                        key={record._id}
                                        record={record}
                                        columns={columns}
                                        headerKey={headerKey}
                                        isSelected={record._id === value?._id}
                                        showCheck
                                        onClick={() => handleSelect(record)}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}
