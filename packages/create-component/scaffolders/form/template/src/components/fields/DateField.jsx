import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function parseValue(value) {
  if (!value) return undefined;
  const isoStr = value.split("T")[0];
  const date = parseISO(isoStr);
  return isNaN(date) ? undefined : date;
}

export function DateField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const selected = parseValue(value);

  const handleSelect = (date) => {
    if (!date) return;
    const formatted = format(date, "yyyy-MM-dd");
    onChange(formatted);
    onBlur(formatted);
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={field.Id}
            type="button"
            variant="outline"
            disabled={disabled || field.ReadOnly}
            className={cn(
              "min-w-36 w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground",
              error && "border-destructive/50 bg-destructive/10"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {selected ? format(selected, "dd/MM/yyyy") : "DD/MM/YYYY"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={selected} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
  );
}
