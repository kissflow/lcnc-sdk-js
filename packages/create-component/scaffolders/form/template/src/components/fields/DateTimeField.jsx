import { useMemo } from "react";
import { format } from "date-fns";
import { CalendarClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError.jsx";

const pad = (n) => String(n).padStart(2, "0");

// Platform stores: "YYYY-MM-DDTHH:mm:00+05:30 Asia/Kolkata" — parse just the
// date+time portion into a local Date for the Calendar/time list to work with.
function parseKFDateTime(val) {
  if (!val) return null;
  const isoStr = typeof val === "string" ? val.split(" ")[0] : "";
  if (!isoStr) return null;
  const date = new Date(isoStr);
  return isNaN(date) ? null : date;
}

// Convert a local Date back to the platform's "YYYY-MM-DDTHH:mm:00±HH:mm TZ" format.
function toKFDateTime(date) {
  if (!date) return null;
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const off = -date.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const absOff = Math.abs(off);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00` +
    `${sign}${pad(Math.floor(absOff / 60))}:${pad(absOff % 60)} ${tzName}`
  );
}

// 12-hour slots in 15-minute increments (12:00 through 11:45) — AM/PM is a
// separate toggle, matching the native platform's DateTime widget layout.
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 15;
  let hour = Math.floor(totalMinutes / 60) % 12;
  if (hour === 0) hour = 12;
  const minute = totalMinutes % 60;
  return { hour, minute, label: `${pad(hour)}:${pad(minute)}` };
});

function to24Hour(hour12, isPM) {
  if (isPM) return hour12 === 12 ? 12 : hour12 + 12;
  return hour12 === 12 ? 0 : hour12;
}

export function DateTimeField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const current = parseKFDateTime(value);
  const isPM = current ? current.getHours() >= 12 : false;
  const hour12 = useMemo(() => {
    if (!current) return null;
    const h = current.getHours() % 12;
    return h === 0 ? 12 : h;
  }, [current]);
  const minute = current ? current.getMinutes() : null;

  const commit = (date) => {
    const formatted = toKFDateTime(date);
    onChange(formatted);
    onBlur(formatted);
  };

  // Calendar has no concept of time — keep whatever time was already set
  // (or midnight for a first-ever pick) and only replace the date part.
  const handleSelectDate = (date) => {
    if (!date) return;
    const next = new Date(date);
    if (current) next.setHours(current.getHours(), current.getMinutes(), 0, 0);
    commit(next);
  };

  const handleSelectSlot = (slot) => {
    const next = current ? new Date(current) : new Date();
    next.setHours(to24Hour(slot.hour, isPM), slot.minute, 0, 0);
    commit(next);
  };

  const handleTogglePeriod = (nextIsPM) => {
    if (!current || nextIsPM === isPM) return;
    const next = new Date(current);
    next.setHours(to24Hour(hour12, nextIsPM));
    commit(next);
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
              "min-w-56 w-full justify-between font-normal",
              !current && "text-muted-foreground",
              error && "border-destructive/50 bg-destructive/10"
            )}
          >
            {current
              ? format(current, "dd/MM/yyyy, HH:mm")
              : "DD/MM/YYYY, HH:mm"}
            <CalendarClockIcon className="size-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="flex">
            <Calendar
              mode="single"
              selected={current ?? undefined}
              onSelect={handleSelectDate}
            />
            <div className="flex flex-col border-l border-border">
              <div className="h-64 w-24 overflow-y-auto py-1">
                {TIME_SLOTS.map((slot) => {
                  const isSelected =
                    current && slot.hour === hour12 && slot.minute === minute;
                  return (
                    <button
                      key={slot.label}
                      type="button"
                      onClick={() => handleSelectSlot(slot)}
                      className={cn(
                        "block w-full px-3 py-1.5 text-center text-sm hover:bg-accent",
                        isSelected &&
                          "bg-accent font-medium text-accent-foreground"
                      )}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex border-t border-border">
                <button
                  type="button"
                  disabled={!current}
                  onClick={() => handleTogglePeriod(false)}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-center text-sm hover:bg-accent disabled:opacity-50",
                    current &&
                      !isPM &&
                      "bg-accent font-medium text-accent-foreground"
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  disabled={!current}
                  onClick={() => handleTogglePeriod(true)}
                  className={cn(
                    "flex-1 border-l border-border px-3 py-1.5 text-center text-sm hover:bg-accent disabled:opacity-50",
                    current &&
                      isPM &&
                      "bg-accent font-medium text-accent-foreground"
                  )}
                >
                  PM
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <FieldError error={error} />
    </div>
  );
}
