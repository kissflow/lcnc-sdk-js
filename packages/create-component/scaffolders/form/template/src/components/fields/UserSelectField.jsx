import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FieldError } from "./FieldError.jsx";

const userId = (user) => user?._id || user;
const userLabel = (user) => user?.Name || user?.name || user?.Email || user;

export function UserSelectField({
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
        setFieldOptions(Array.isArray(fetchedOptions) ? fetchedOptions : []);
      } catch (err) {
        console.error(`Failed to fetch options for ${field.Name}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (selectedId) => {
    if (!selectedId) return;
    const user =
      fieldOptions.find((option) => userId(option) === selectedId) || null;
    onChange(user);
    onBlur(user);
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
        value={value ? userId(value) : ""}
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
          {fieldOptions.map((user) => (
            <SelectItem key={userId(user)} value={userId(user)}>
              {userLabel(user)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError error={error} />
    </div>
  );
}
