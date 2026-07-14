import { Slider } from "@/components/ui/slider";
import { FieldError } from "./FieldError.jsx";

export function SliderField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const min = Number(field.MinValue) ?? 0;
  const max = Number(field.MaxValue) ?? 10;
  const step = Number(field.IntervalSize) ?? 1;
  const current = value ?? Number(field.DefaultValue) ?? min;

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.Id}
        className="block text-sm font-semibold text-foreground"
      >
        {field.Name}
        {field.Required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="flex items-center gap-4 pt-2">
        <Slider
          id={field.Id}
          value={[current]}
          min={min}
          max={max}
          step={step}
          disabled={disabled || field.ReadOnly}
          onValueChange={([val]) => onChange(val)}
          onValueCommit={([val]) => onBlur(val)}
        />
        <span className="w-12 text-right text-sm font-medium text-muted-foreground tabular-nums">
          {current}
        </span>
      </div>
      <FieldError error={error} />
    </div>
  );
}
