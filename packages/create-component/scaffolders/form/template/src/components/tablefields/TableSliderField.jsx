import { Slider } from "@/components/ui/slider";

export function TableSliderField({ field, value, onChange, onBlur, disabled }) {
  const min = Number(field.MinValue) || 0;
  const max = Number(field.MaxValue) || 10;
  const step = Number(field.IntervalSize) || 1;
  const current = value ?? Number(field.DefaultValue) ?? min;

  return (
    <div className="flex items-center gap-2 h-8 px-2">
      <Slider
        value={[current]}
        min={min}
        max={max}
        step={step}
        disabled={disabled || field.ReadOnly}
        onValueChange={([val]) => onChange(val)}
        onValueCommit={([val]) => onBlur(val)}
        className="flex-1"
      />
      <span className="w-8 text-right text-xs font-medium text-muted-foreground tabular-nums shrink-0">
        {current}
      </span>
    </div>
  );
}
