import { Slider } from '@/components/ui/slider'

export function SliderField({
    field,
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
}) {
    const min = Number(field.MinValue) ?? 0
    const max = Number(field.MaxValue) ?? 10
    const step = Number(field.IntervalSize) ?? 1
    const current = value ?? Number(field.DefaultValue) ?? min

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
            {error && (
                <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    )
}
