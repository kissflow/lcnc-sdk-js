import { Loader2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocationPicker } from "../fields/useGeolocationPicker.js";

export function TableGeolocationField({
  field,
  value,
  onChange,
  onBlur,
  disabled
}) {
  const { picking, pick } = useGeolocationPicker();
  const readOnly = disabled || field.ReadOnly;

  const handlePick = async () => {
    const result = await pick(value);
    if (result) {
      onChange(result);
      onBlur(result);
    }
  };

  const handleClear = () => {
    onChange(null);
    onBlur(null);
  };

  return (
    <div className="flex items-center gap-1 px-1">
      <span className="flex-1 min-w-0 truncate text-sm" title={value?.Address}>
        {value?.Address ||
          (value?.Latitude && value?.Longitude
            ? `${value.Latitude}, ${value.Longitude}`
            : "—")}
      </span>
      {!readOnly && (
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePick}
            disabled={picking}
            aria-label="Pick location"
          >
            {picking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleClear}
              aria-label="Clear location"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
