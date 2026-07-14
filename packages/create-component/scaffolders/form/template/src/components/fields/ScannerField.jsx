import { Loader2, ScanLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldError } from "./FieldError.jsx";
import { useScanner } from "./useScanner.js";

export function ScannerField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const { scanning, scanError, scan } = useScanner();
  const readOnly = disabled || field.ReadOnly;

  const handleScan = async () => {
    const result = await scan(field);
    if (result) {
      onChange(result);
      onBlur(result);
    }
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
      <div className="flex gap-2">
        <Input
          id={field.Id}
          type="text"
          name={field.Id}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          placeholder={`Scan or enter ${field.Name.toLowerCase()}`}
          disabled={readOnly}
          className={error ? "border-destructive/50 bg-destructive/10" : ""}
        />
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleScan}
            disabled={scanning}
            aria-label="Scan barcode"
          >
            {scanning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ScanLine className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
      <FieldError error={scanError || error} />
    </div>
  );
}
