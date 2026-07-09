import { useState } from 'react'
import { Star } from 'lucide-react'

export function TableRatingField({ field, value, onChange, onBlur, disabled }) {
    const [hovered, setHovered] = useState(null)
    const maxRating = field.MaxRating || 5
    const display = hovered ?? value ?? 0
    const readOnly = disabled || field.ReadOnly

    const handleSelect = (rating) => {
        const next = rating === value ? null : rating
        onChange(next)
        onBlur(next)
    }

    return (
        <div
            className={`flex items-center gap-0.5 h-8 px-1 ${readOnly ? 'opacity-50' : ''}`}
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
                        onClick={() => !readOnly && handleSelect(star)}
                        className="cursor-pointer disabled:cursor-not-allowed"
                    >
                        <Star
                            className={`w-4 h-4 transition-colors ${
                                filled
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-transparent text-gray-300'
                            }`}
                        />
                    </button>
                )
            })}
        </div>
    )
}
