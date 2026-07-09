import { useState, useEffect } from 'react'
import {
    Paperclip,
    X,
    Loader2,
    File,
    FileImage,
    FileText,
    FileSpreadsheet,
    FileArchive,
    FileVideo,
    FileAudio,
} from 'lucide-react'

const ATTACHMENT_PICKER_OPTIONS = {
    fileExtensions: ['*'],
    maxSize: 104857600,
    maxCount: 10,
    imageProps: {
        sizes: [
            [1200, 800],
            [100, 100],
        ],
        crop: false,
    },
}

const ICONS_BY_EXT = {
    JPG: FileImage,
    JPEG: FileImage,
    PNG: FileImage,
    GIF: FileImage,
    SVG: FileImage,
    PDF: FileText,
    DOC: FileText,
    DOCX: FileText,
    TXT: FileText,
    XLS: FileSpreadsheet,
    XLSX: FileSpreadsheet,
    CSV: FileSpreadsheet,
    ZIP: FileArchive,
    RAR: FileArchive,
    MP4: FileVideo,
    MOV: FileVideo,
    MP3: FileAudio,
    WAV: FileAudio,
}

const iconForFile = (file) =>
    ICONS_BY_EXT[(file.fileExtension || '').toUpperCase()] || File

const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function AttachmentField({
    field,
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
}) {
    const [files, setFiles] = useState(Array.isArray(value) ? value : [])
    const [picking, setPicking] = useState(false)
    const readOnly = disabled || field.ReadOnly

    useEffect(() => {
        setFiles(Array.isArray(value) ? value : [])
    }, [value])

    const handlePick = async () => {
        setPicking(true)
        try {
            const picked = await window.kf.client.openFilePicker(ATTACHMENT_PICKER_OPTIONS)
            if (picked?.length) {
                const next = [...files, ...picked]
                setFiles(next)
                onChange(next)
                onBlur(next)
            }
        } catch (err) {
            console.error(`Failed to pick attachments for ${field.Name}:`, err)
        } finally {
            setPicking(false)
        }
    }

    const handlePreview = (index) => {
        if (!files.length) return
        window.kf.client.openFilePreview({ files, indexOfFile: index })
    }

    const handleRemove = (e, key) => {
        e.stopPropagation()
        const next = files.filter((f) => f.key !== key)
        const updated = next.length ? next : null
        setFiles(next)
        onChange(updated)
        onBlur(updated)
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
            <div
                id={field.Id}
                className="space-y-2 border border-gray-300 rounded-lg p-3"
            >
                {files.length > 0 ? (
                    files.map((file, index) => {
                        const Icon = iconForFile(file)
                        return (
                            <div
                                key={file.key || index}
                                onClick={() => handlePreview(index)}
                                className="group flex items-center gap-2.5 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 cursor-pointer hover:border-gray-300 hover:bg-gray-100 transition-colors"
                            >
                                <Icon className="w-5 h-5 text-gray-400 shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-700 truncate">
                                        {file.name}
                                    </p>
                                    {file.size != null && (
                                        <p className="text-xs text-gray-400">
                                            {formatSize(file.size)}
                                        </p>
                                    )}
                                </div>
                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemove(e, file.key)}
                                        className="p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-600 hover:bg-white"
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <p className="text-sm text-gray-500">No attachments</p>
                )}
                {!readOnly && (
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
                        <span>Add attachment{ATTACHMENT_PICKER_OPTIONS.maxCount > 1 ? '(s)' : ''}</span>
                    </button>
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
