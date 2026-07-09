import { useState } from 'react'
import { Star } from 'lucide-react'

export function RatingField({ field, value, onChange, onBlur, error, disabled = false }) {
    const [hovered, setHovered] = useState(null)
    const maxRating = field.MaxRating || 5
    const readOnly = disabled || field.ReadOnly
    const display = hovered ?? value ?? 0

    const handleSelect = (rating) => {
        const next = rating === value ? null : rating
        onChange(next)
        onBlur(next)
    }

    return (
        <div className="space-y-2">
            <label htmlFor={field.Id} className="block text-sm font-semibold text-foreground">
                {field.Name}
                {field.Required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div
                id={field.Id}
                className={`flex items-center gap-1 ${readOnly ? 'opacity-50' : ''}`}
                onMouseLeave={() => setHovered(null)}
            >
                {Array.from({ length: maxRating }, (_, i) => {
                    const star = i + 1
                    const filled = star <= display
                    return (
                        <button
                            key={star}
                            type="button"
                            disabled={readOnly}
                            onMouseEnter={() => !readOnly && setHovered(star)}
                            onClick={() => handleSelect(star)}
                            className="cursor-pointer disabled:cursor-not-allowed"
                        >
                            <Star
                                className={`w-6 h-6 transition-colors ${
                                    filled ? 'fill-warning text-warning' : 'fill-transparent text-muted-foreground'
                                }`}
                            />
                        </button>
                    )
                })}
                {value != null && (
                    <span className="ml-2 text-sm text-muted-foreground">{value} / {maxRating}</span>
                )}
            </div>
            {error && (
                <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                    </svg>
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    )
}
