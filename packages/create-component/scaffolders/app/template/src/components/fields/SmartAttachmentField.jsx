import { useState, useEffect } from 'react'
import { Paperclip, X, Loader2, Sparkles, FileText, FileImage } from 'lucide-react'

// Matches the platform's SMART_ATTACHMENT_WIDGET constants
// (widgets/common/src/libs/document.parser.service.js)
const SMART_ATTACHMENT_PICKER_OPTIONS = {
    fileExtensions: ['PDF', 'JPG', 'JPEG', 'PNG'],
    maxSize: 1024 * 1024 * 20,
    maxCount: 1,
}

const ICONS_BY_EXT = {
    JPG: FileImage,
    JPEG: FileImage,
    PNG: FileImage,
    PDF: FileText,
}

const iconForFile = (file) =>
    ICONS_BY_EXT[(file.fileExtension || '').toUpperCase()] || FileText

const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function SmartAttachmentField({
    field,
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    parseAttachment,
}) {
    const [file, setFile] = useState(Array.isArray(value) ? value[0] : value || null)
    const [picking, setPicking] = useState(false)
    const [parsing, setParsing] = useState(false)
    const [autofillResult, setAutofillResult] = useState(null)
    const [parseError, setParseError] = useState(null)
    const readOnly = disabled || field.ReadOnly

    useEffect(() => {
        setFile(Array.isArray(value) ? value[0] : value || null)
    }, [value])

    const handlePick = async () => {
        setPicking(true)
        setParseError(null)
        try {
            const picked = await window.kf.client.openFilePicker(
                SMART_ATTACHMENT_PICKER_OPTIONS
            )
            const pickedFile = picked?.[0]
            if (!pickedFile) return

            setFile(pickedFile)
            onChange([pickedFile])
            onBlur([pickedFile])

            if (!parseAttachment) return
            setParsing(true)
            setAutofillResult(null)
            try {
                const result = await parseAttachment(field.Id, pickedFile)
                setAutofillResult(result)
            } catch (err) {
                setParseError(err.message || 'Autofill failed, please try again.')
            } finally {
                setParsing(false)
            }
        } catch (err) {
            console.error(`Failed to pick file for ${field.Name}:`, err)
        } finally {
            setPicking(false)
        }
    }

    const handlePreview = () => {
        if (!file) return
        window.kf.client.openFilePreview({ files: [file] })
    }

    const handleRemove = (e) => {
        e.stopPropagation()
        setFile(null)
        setAutofillResult(null)
        setParseError(null)
        onChange(null)
        onBlur(null)
    }

    const Icon = file ? iconForFile(file) : Paperclip

    return (
        <div className="space-y-2">
            <label
                htmlFor={field.Id}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700"
            >
                {field.Name}
                {field.Required && <span className="text-red-500 ml-1">*</span>}
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            </label>
            <div
                id={field.Id}
                className="space-y-2 border border-gray-300 rounded-lg p-3"
            >
                {file ? (
                    <div
                        onClick={handlePreview}
                        className="group flex items-center gap-2.5 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 cursor-pointer hover:border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                        <Icon className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-700 truncate">{file.name}</p>
                            {file.size != null && (
                                <p className="text-xs text-gray-400">
                                    {formatSize(file.size)}
                                </p>
                            )}
                        </div>
                        {!readOnly && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-600 hover:bg-white"
                                aria-label={`Remove ${file.name}`}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No file attached</p>
                )}

                {!readOnly && !file && (
                    <button
                        type="button"
                        onClick={handlePick}
                        disabled={picking}
                        className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 transition-colors cursor-pointer hover:border-gray-400 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {picking ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Paperclip className="w-4 h-4" />
                        )}
                        <span>Attach file (PDF, JPG, PNG)</span>
                    </button>
                )}

                {parsing && (
                    <p className="flex items-center gap-1.5 text-sm text-purple-600">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Autofilling fields from {file?.name}...
                    </p>
                )}

                {!parsing && autofillResult && (
                    <p className="text-sm text-purple-600">
                        Auto-filled {autofillResult.appliedFields?.length || 0} field
                        {autofillResult.appliedFields?.length === 1 ? '' : 's'} from{' '}
                        {autofillResult.suggestedBy}
                    </p>
                )}

                {!parsing && parseError && (
                    <p className="text-sm text-red-600">{parseError}</p>
                )}
            </div>
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
