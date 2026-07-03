import { useState, useEffect } from 'react'
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react'

const IMAGE_PICKER_OPTIONS = {
    fileExtensions: ['JPG', 'JPEG', 'BMP', 'PNG'],
    maxSize: 104857600,
    maxCount: 1,
    imageProps: {
        sizes: [
            [1200, 800],
            [300, 300],
        ],
        crop: false,
    },
}

export function ImageField({
    field,
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
}) {
    const [previewUrl, setPreviewUrl] = useState(null)
    const [resolving, setResolving] = useState(false)
    const [picking, setPicking] = useState(false)
    const readOnly = disabled || field.ReadOnly

    useEffect(() => {
        let cancelled = false

        const resolvePreview = async () => {
            if (!value?.key) {
                setPreviewUrl(null)
                return
            }
            setResolving(true)
            try {
                const dataUrl = await window.kf.client.getImageUrl(value)
                if (!cancelled) setPreviewUrl(dataUrl)
            } catch (err) {
                console.error(`Failed to resolve image for ${field.Name}:`, err)
                if (!cancelled) setPreviewUrl(null)
            } finally {
                if (!cancelled) setResolving(false)
            }
        }

        resolvePreview()
        return () => {
            cancelled = true
        }
    }, [value?.key])

    const handlePick = async () => {
        setPicking(true)
        try {
            const files = await window.kf.client.openFilePicker(IMAGE_PICKER_OPTIONS)
            const file = files?.[0]
            if (file) {
                onChange(file)
                onBlur(file)
            }
        } catch (err) {
            console.error(`Failed to pick image for ${field.Name}:`, err)
        } finally {
            setPicking(false)
        }
    }

    const handlePreview = () => {
        if (!value) return
        window.kf.client.openFilePreview({ files: [value] })
    }

    const handleRemove = (e) => {
        e.stopPropagation()
        onChange(null)
        onBlur(null)
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
            {value?.key ? (
                <div
                    id={field.Id}
                    className="relative group w-40 h-40 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 cursor-pointer"
                    onClick={handlePreview}
                >
                    {resolving && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                    )}
                    {!resolving && previewUrl && (
                        <img
                            src={previewUrl}
                            alt={value.name || field.Name}
                            className="w-full h-full object-cover"
                        />
                    )}
                    {!readOnly && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-600 hover:bg-white"
                            aria-label={`Remove ${field.Name}`}
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            ) : readOnly ? (
                <div
                    id={field.Id}
                    className="w-40 h-40 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300"
                >
                    <ImageIcon className="w-8 h-8" />
                </div>
            ) : (
                <button
                    id={field.Id}
                    type="button"
                    onClick={handlePick}
                    disabled={picking}
                    className={`w-40 h-40 rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 text-sm text-gray-500 transition-colors cursor-pointer hover:border-gray-400 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                        error
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-gray-50'
                    }`}
                >
                    {picking ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <Upload className="w-6 h-6" />
                            <span>Upload image</span>
                        </>
                    )}
                </button>
            )}
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
