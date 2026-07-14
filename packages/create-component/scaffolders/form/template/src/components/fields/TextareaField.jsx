import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "./FieldError.jsx";
import { FieldLabel } from "./FieldLabel.jsx";

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
      <FieldLabel field={field} htmlFor={field.Id} />
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
