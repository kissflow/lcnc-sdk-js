import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "./FieldError.jsx";
import { FieldLabel } from "./FieldLabel.jsx";

export function CheckboxField({
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
  const selectedValues = Array.isArray(value) ? value : [];

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

  const handleChange = (option, checked) => {
    const next = checked
      ? [...selectedValues, option]
      : selectedValues.filter((item) => item !== option);
    onChange(next);
    onBlur(next);
  };

  return (
    <div className="space-y-2">
      <FieldLabel field={field} />
      <div className="space-y-2 border border-input rounded-lg p-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading options...</p>
        ) : fieldOptions.length > 0 ? (
          fieldOptions.map((option) => {
            const optionValue = option?._id || option?.name || option;
            const optionLabel = option?.Name || option?.name || option;
            return (
              <div key={optionValue} className="flex items-center gap-2">
                <Checkbox
                  id={`${field.Id}-${optionValue}`}
                  checked={selectedValues.includes(optionValue)}
                  onCheckedChange={(checked) =>
                    handleChange(optionValue, checked)
                  }
                  disabled={disabled || field.ReadOnly}
                />
                <label
                  htmlFor={`${field.Id}-${optionValue}`}
                  className="text-sm cursor-pointer"
                >
                  {optionLabel}
                </label>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No options available</p>
        )}
      </div>
      <FieldError error={error} />
    </div>
  );
}
