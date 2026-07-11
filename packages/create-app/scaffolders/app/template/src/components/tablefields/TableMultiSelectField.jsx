import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTableFieldOptions } from "./useTableFieldOptions.js";

export function TableMultiSelectField({
  field,
  value,
  onChange,
  onBlur,
  disabled,
  getFieldOptions
}) {
  const [open, setOpen] = useState(false);
  const options = useTableFieldOptions(field, getFieldOptions);

  const selected = Array.isArray(value) ? value : [];

  const getLabel = (opt) => opt.Name || opt.name || opt;
  const getId = (opt) => opt._id || opt.name || opt;

  const isChecked = (opt) => selected.includes(getId(opt));

  const handleToggle = (opt) => {
    const id = getId(opt);
    const next = isChecked(opt)
      ? selected.filter((v) => v !== id)
      : [...selected, id];
    const committed = next.length ? next : null;
    onChange(committed);
    onBlur(committed);
  };

  const displayLabels = options
    .filter((opt) => isChecked(opt))
    .map((opt) => getLabel(opt));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled || field.ReadOnly}
          className="w-full min-w-[120px] h-8 flex items-center gap-1 px-2 text-sm bg-background border border-border rounded-md hover:border-input disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex-1 flex items-center gap-1 overflow-hidden min-w-0">
            {displayLabels.length === 0 ? (
              <span className="text-muted-foreground text-xs">—</span>
            ) : (
              <>
                {displayLabels.slice(0, 2).map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="text-xs px-1.5 py-0 h-5 shrink-0"
                  >
                    {label}
                  </Badge>
                ))}
                {displayLabels.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0 h-5 shrink-0"
                  >
                    +{displayLabels.length - 2}
                  </Badge>
                )}
              </>
            )}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        <ScrollArea className="max-h-48">
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2 px-2">
              No options
            </p>
          ) : (
            options.map((opt) => (
              <button
                key={getId(opt)}
                type="button"
                onClick={() => handleToggle(opt)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted cursor-pointer text-left"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    isChecked(opt)
                      ? "bg-primary/100 border-ring text-primary-foreground"
                      : "border-input"
                  }`}
                >
                  {isChecked(opt) && <Check className="w-2.5 h-2.5" />}
                </div>
                {getLabel(opt)}
              </button>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
