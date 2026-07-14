import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "./FieldError.jsx";

export function TextareaField({
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
      <Textarea
        id={field.Id}
        name={field.Id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        placeholder={`Enter ${field.Name.toLowerCase()}`}
        disabled={disabled || field.ReadOnly}
        rows={4}
        className={error ? "border-destructive/50 bg-destructive/10" : ""}
      />
      <FieldError error={error} />
    </div>
  );
}
