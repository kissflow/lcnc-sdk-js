import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FieldError } from "./FieldError.jsx";

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
      <label
        htmlFor={field.Id}
        className="block text-sm font-semibold text-foreground"
      >
        {field.Name}
        {field.Required && <span className="text-destructive ml-1">*</span>}
      </label>
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
