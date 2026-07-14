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
  const isoStr = String(value).split("T")[0];
  const date = parseISO(isoStr);
  return isNaN(date) ? undefined : date;
}

export function TableDateField({ field, value, onChange, onBlur, disabled }) {
  const selected = parseValue(value);

  const handleSelect = (date) => {
    const formatted = date ? format(date, "yyyy-MM-dd") : null;
    onChange(formatted);
    onBlur(formatted);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || field.ReadOnly}
          className={cn(
            "h-8 min-w-36 w-full justify-start gap-1.5 px-2 text-sm font-normal border-border",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="size-3.5" />
          {selected ? format(selected, "dd/MM/yyyy") : "DD/MM/YYYY"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
