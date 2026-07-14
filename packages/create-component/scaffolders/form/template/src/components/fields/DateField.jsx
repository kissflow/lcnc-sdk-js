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
import { FieldError } from "./FieldError.jsx";

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
      <FieldError error={error} />
    </div>
  );
}
