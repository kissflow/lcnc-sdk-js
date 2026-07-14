import { useState, useEffect } from "react";
import { Loader2, ScanLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useScanner } from "../fields/useScanner.js";

export function TableScannerField({
  field,
  value,
  onChange,
  onBlur,
  disabled
}) {
  const [local, setLocal] = useState(value ?? "");
  const { scanning, scan } = useScanner();
  const readOnly = disabled || field.ReadOnly;

  useEffect(
    function syncValue() {
      setLocal(value ?? "");
    },
    [value]
  );

  const handleScan = async () => {
    const result = await scan(field);
    if (result) {
      setLocal(result);
      onChange(result);
      onBlur(result);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        type="text"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange(e.target.value);
        }}
        onBlur={() => onBlur(local || null)}
        disabled={readOnly}
        placeholder="—"
        className="h-8 text-sm px-2 border-transparent hover:border-border focus-visible:border-input focus-visible:ring-1 focus-visible:ring-ring bg-transparent hover:bg-background focus-visible:bg-background transition-colors"
      />
      {!readOnly && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleScan}
          disabled={scanning}
          aria-label="Scan barcode"
        >
          {scanning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ScanLine className="w-3.5 h-3.5" />
          )}
        </Button>
      )}
    </div>
  );
}
