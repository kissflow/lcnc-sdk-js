import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, X, ChevronDown, Check, Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

// Value: full record object { _id, Name, ...displayFields } or null.

export const formatFieldValue = (val) => {
    if (val == null || val === '') return 'N/A'
    if (Array.isArray(val))
        return (
            val
                .map((v) =>
                    typeof v === 'object' && v !== null
                        ? (v.Name ?? String(v))
                        : String(v)
                )
                .filter(Boolean)
                .join(', ') || 'N/A'
        )
    if (typeof val === 'object') return val.Name ?? JSON.stringify(val)
    return String(val)
}

// columns: [{ Id, Name, Type }] from field.LookupColumns (query definition).
// headerKey: field Id used as the card title, from LookupConfigurations.SelectedHeaderField.Id.
// Falls back to "Name" when not configured — matches the platform default.
export function RecordCard({ record, columns, headerKey, isSelected, onClick, showCheck = false }) {
    const titleKey = headerKey || 'Name'
    const title = record[titleKey] ?? record.Name ?? record._id
    const bodyColumns = columns.filter((col) => col.Id !== titleKey)

    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left rounded-lg border px-4 py-3 transition-colors cursor-pointer ${
                isSelected
                    ? 'border-ring bg-primary/10 ring-1 ring-ring'
                    : 'border-border bg-background hover:border-input hover:bg-muted'
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1 truncate font-semibold text-foreground text-sm leading-snug">
                    {formatFieldValue(title)}
                </p>
                {showCheck && isSelected && (
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                )}
            </div>
            {bodyColumns.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
                    {bodyColumns.map((col) => (
                        <div key={col.Id} className="min-w-0">
                            <p className="text-xs text-muted-foreground truncate">
                                {col.Name}
                            </p>
                            <p className="text-sm text-foreground truncate">
                                {formatFieldValue(record[col.Id])}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </button>
    )
}

export function LookupField({
    field,
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    getFieldOptions,
}) {
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const searchRef = useRef(null)

    const readOnly = disabled || field.ReadOnly
    const columns = field.LookupColumns || []
    const headerKey = field.LookupConfigurations?.SelectedHeaderField?.Id

    const loadOptions = useCallback(
        async function fetchLookupOptions() {
            setLoading(true)
            try {
                const opts = await getFieldOptions(field.Id)
                setOptions(Array.isArray(opts) ? opts : [])
            } catch (err) {
                console.error(
                    `Failed to load lookup options for ${field.Name}:`,
                    err
                )
                setOptions([])
            } finally {
                setLoading(false)
            }
        },
        [field.Id, field.Name, getFieldOptions]
    )

    useEffect(
        function openEffect() {
            if (open) {
                loadOptions()
                // focus search after dialog animates in
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
                  formatFieldValue(v)
                      .toLowerCase()
                      .includes(search.toLowerCase())
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

    const selectedId = value?._id

    return (
        <div className="min-w-0 space-y-2">
            <label className="block text-sm font-semibold text-foreground">
                {field.Name}
                {field.Required && <span className="text-destructive ml-1">*</span>}
            </label>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => !readOnly && setOpen(true)}
                disabled={readOnly}
                className={`w-full text-left rounded-md border transition-colors ${
                    error
                        ? 'border-destructive/50 bg-destructive/10'
                        : 'border-input bg-background'
                } ${
                    readOnly
                        ? 'bg-muted cursor-default'
                        : 'hover:border-input cursor-pointer'
                }`}
            >
                {value ? (
                    <div className="relative p-3">
                        <RecordCard
                            record={value}
                            columns={columns}
                            headerKey={headerKey}
                            isSelected={false}
                            onClick={() => {}}
                        />
                        {!readOnly && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute top-2 right-2 p-1 rounded-full text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                                aria-label="Clear selection"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-muted-foreground">
                        <span className="min-w-0 flex-1 truncate">
                            Select {field.Name.toLowerCase()}…
                        </span>
                        <ChevronDown className="w-4 h-4 shrink-0" />
                    </div>
                )}
            </button>

            {/* Picker dialog */}
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
                                    {search
                                        ? 'No results match your search'
                                        : 'No options available'}
                                </p>
                            ) : (
                                filtered.map((record) => (
                                    <RecordCard
                                        key={record._id}
                                        record={record}
                                        columns={columns}
                                        headerKey={headerKey}
                                        isSelected={record._id === selectedId}
                                        showCheck
                                        onClick={() => handleSelect(record)}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {error && (
                <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
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
