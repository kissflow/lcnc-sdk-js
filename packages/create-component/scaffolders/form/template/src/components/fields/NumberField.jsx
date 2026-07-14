import { Input } from "@/components/ui/input";
import { FieldError } from "./FieldError.jsx";
import { FieldLabel } from "./FieldLabel.jsx";

export function NumberField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  return (
    <div className="space-y-2">
      <FieldLabel field={field} htmlFor={field.Id} />
      <Input
        id={field.Id}
        type="number"
        name={field.Id}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        onBlur={(e) => onBlur(Number(e.target.value))}
        placeholder={`Enter ${field.Name.toLowerCase()}`}
        disabled={disabled || field.ReadOnly}
        className={error ? "border-destructive/50 bg-destructive/10" : ""}
      />
      <FieldError error={error} />
    </div>
  );
}
