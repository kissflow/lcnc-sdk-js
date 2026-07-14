import { Loader2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "./FieldError.jsx";
import { useGeolocationPicker } from "./useGeolocationPicker.js";

export function GeolocationField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const { picking, pickError, pick } = useGeolocationPicker();
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
    <div className="space-y-2">
      <label
        htmlFor={field.Id}
        className="block text-sm font-semibold text-foreground"
      >
        {field.Name}
        {field.Required && <span className="text-destructive ml-1">*</span>}
      </label>

      {value?.Latitude && value?.Longitude ? (
        <div
          id={field.Id}
          className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${error ? "border-destructive/50 bg-destructive/10" : "border-input"}`}
        >
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">
              {value.Address || `${value.Latitude}, ${value.Longitude}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {value.Latitude}, {value.Longitude}
            </p>
          </div>
          {!readOnly && (
            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handlePick}
                disabled={picking}
              >
                {picking ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Change"
                )}
              </Button>
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
            </div>
          )}
        </div>
      ) : (
        !readOnly && (
          <Button
            id={field.Id}
            type="button"
            variant="outline"
            onClick={handlePick}
            disabled={picking}
            className="gap-2"
          >
            {picking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            Pick location
          </Button>
        )
      )}
      <FieldError error={pickError || error} />
    </div>
  );
}
