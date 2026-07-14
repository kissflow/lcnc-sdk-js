import { useState } from "react";
import { Star } from "lucide-react";
import { FieldError } from "./FieldError.jsx";
import { FieldLabel } from "./FieldLabel.jsx";

export function RatingField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const [hovered, setHovered] = useState(null);
  const maxRating = field.MaxRating || 5;
  const readOnly = disabled || field.ReadOnly;
  const display = hovered ?? value ?? 0;

  const handleSelect = (rating) => {
    const next = rating === value ? null : rating;
    onChange(next);
    onBlur(next);
  };

  return (
    <div className="space-y-2">
      <FieldLabel field={field} htmlFor={field.Id} />
      <div
        id={field.Id}
        className={`flex items-center gap-1 ${readOnly ? "opacity-50" : ""}`}
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: maxRating }, (_, i) => {
          const star = i + 1;
          const filled = star <= display;
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
                  filled
                    ? "fill-warning text-warning"
                    : "fill-transparent text-muted-foreground"
                }`}
              />
            </button>
          );
        })}
        {value != null && (
          <span className="ml-2 text-sm text-muted-foreground">
            {value} / {maxRating}
          </span>
        )}
      </div>
      <FieldError error={error} />
    </div>
  );
}
