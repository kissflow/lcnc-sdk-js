import { Input } from "@/components/ui/input";
import { FieldError } from "./FieldError.jsx";

export function TextField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={field.Id}
        className="block text-sm font-semibold text-foreground"
      >
        {field.Name}
        {field.Required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input
        id={field.Id}
        type="text"
        name={field.Id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        placeholder={`Enter ${field.Name.toLowerCase()}`}
        disabled={disabled || field.ReadOnly}
        className={error ? "border-destructive/50 bg-destructive/10" : ""}
      />
      <FieldError error={error} />
    </div>
  );
}
