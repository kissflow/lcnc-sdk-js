import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FieldError } from "./FieldError.jsx";
import { FieldLabel } from "./FieldLabel.jsx";

export function BooleanField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const handleChange = (val) => {
    const boolValue = val === "true";
    onChange(boolValue);
    onBlur(boolValue);
  };

  return (
    <div className="space-y-2">
      <FieldLabel field={field} htmlFor={field.Id} />
      <Select
        value={value ? "true" : "false"}
        onValueChange={handleChange}
        disabled={disabled || field.ReadOnly}
      >
        <SelectTrigger
          id={field.Id}
          className={error ? "border-destructive/50 bg-destructive/10" : ""}
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Yes</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>
      <FieldError error={error} />
    </div>
  );
}
