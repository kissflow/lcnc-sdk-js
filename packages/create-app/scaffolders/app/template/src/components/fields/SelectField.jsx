import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { FieldError } from "./FieldError.jsx";
import { FieldLabel } from "./FieldLabel.jsx";

export function SelectField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  getFieldOptions
}) {
  const [fieldOptions, setFieldOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const fetchedOptions = await getFieldOptions(field.Id);
        setFieldOptions(fetchedOptions);
      } catch (err) {
        console.error(`Failed to fetch options for ${field.Name}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (selectedValue) => {
    if (!selectedValue) return;
    onChange(selectedValue);
    onBlur(selectedValue);
  };

  return (
    <div className="space-y-2">
      <FieldLabel field={field} htmlFor={field.Id} />
      <Select
        value={value || ""}
        onValueChange={handleChange}
        disabled={disabled || field.ReadOnly || loading}
      >
        <SelectTrigger
          id={field.Id}
          className={error ? "border-destructive/50 bg-destructive/10" : ""}
        >
          <SelectValue placeholder={`Select ${field.Name.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {fieldOptions.map((option) => (
            <SelectItem
              key={option._id || option.name || option}
              value={option._id || option.name || option}
            >
              {option.Name || option.name || option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError error={error} />
    </div>
  );
}
