import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldError } from "./FieldError.jsx";

export function RadioField({
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
    onChange(selectedValue);
    onBlur(selectedValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        {field.Name}
        {field.Required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="space-y-2 border border-input rounded-lg p-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading options...</p>
        ) : fieldOptions.length > 0 ? (
          <RadioGroup
            value={value || ""}
            onValueChange={handleChange}
            disabled={disabled || field.ReadOnly}
          >
            {fieldOptions.map((option) => {
              const optionId = option._id || option.name || option;
              const optionLabel = option.Name || option.name || option;
              return (
                <div key={optionId} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={optionId}
                    id={`${field.Id}-${optionId}`}
                    disabled={disabled || field.ReadOnly}
                  />
                  <label
                    htmlFor={`${field.Id}-${optionId}`}
                    className="text-sm cursor-pointer"
                  >
                    {optionLabel}
                  </label>
                </div>
              );
            })}
          </RadioGroup>
        ) : (
          <p className="text-sm text-muted-foreground">No options available</p>
        )}
      </div>
      <FieldError error={error} />
    </div>
  );
}
