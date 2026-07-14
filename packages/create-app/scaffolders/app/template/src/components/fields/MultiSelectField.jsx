import { useState, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FieldError } from "./FieldError.jsx";
import { FieldLabel } from "./FieldLabel.jsx";

export function MultiSelectField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  getFieldOptions
}) {
  const [open, setOpen] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedValues = Array.isArray(value) ? value : [];
  const readOnly = disabled || field.ReadOnly;

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

  const getId = (opt) => opt._id || opt.name || opt;
  const getLabel = (opt) => opt.Name || opt.name || opt;
  const isChecked = (opt) => selectedValues.includes(getId(opt));

  const commit = (next) => {
    const committed = next.length ? next : null;
    onChange(committed);
    onBlur(committed);
  };

  const handleToggle = (opt) => {
    const id = getId(opt);
    commit(
      isChecked(opt)
        ? selectedValues.filter((v) => v !== id)
        : [...selectedValues, id]
    );
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    commit(selectedValues.filter((v) => v !== id));
  };

  const selectedOptions = fieldOptions.filter(isChecked);

  return (
    <div className="min-w-0 space-y-2">
      <FieldLabel field={field} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={readOnly || loading}
            className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              error ? "border-destructive/50 bg-destructive/10" : "border-input"
            } ${readOnly ? "bg-muted" : "bg-background cursor-pointer hover:border-input"}`}
          >
            <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              {loading ? (
                <span className="text-sm text-muted-foreground">Loading…</span>
              ) : selectedOptions.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  Select {field.Name.toLowerCase()}…
                </span>
              ) : (
                selectedOptions.map((opt) => (
                  <Badge
                    key={getId(opt)}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    <span className="max-w-[140px] truncate">
                      {getLabel(opt)}
                    </span>
                    {!readOnly && (
                      <span
                        role="button"
                        onClick={(e) => handleRemove(e, getId(opt))}
                        className="rounded-full p-0.5 hover:bg-foreground/10"
                        aria-label={`Remove ${getLabel(opt)}`}
                      >
                        <X className="w-3 h-3" />
                      </span>
                    )}
                  </Badge>
                ))
              )}
            </span>
            <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-1" align="start">
          <ScrollArea className="max-h-56">
            {fieldOptions.length === 0 ? (
              <p className="px-2 py-2 text-sm text-muted-foreground">
                No options available
              </p>
            ) : (
              fieldOptions.map((opt) => {
                const id = getId(opt);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleToggle(opt)}
                    className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-muted"
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isChecked(opt)
                          ? "border-ring bg-primary/100 text-primary-foreground"
                          : "border-input"
                      }`}
                    >
                      {isChecked(opt) && <Check className="w-2.5 h-2.5" />}
                    </div>
                    {getLabel(opt)}
                  </button>
                );
              })
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <FieldError error={error} />
    </div>
  );
}
