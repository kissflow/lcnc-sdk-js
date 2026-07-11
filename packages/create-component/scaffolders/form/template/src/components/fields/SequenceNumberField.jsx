import { Hash } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SequenceNumberField({ field, value }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={field.Id}
        className="block text-sm font-semibold text-foreground"
      >
        {field.Name}
        {field.Required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="relative">
        <Input
          id={field.Id}
          type="text"
          name={field.Id}
          value={value ?? ""}
          readOnly
          className="pr-9 bg-muted cursor-default"
        />
        <Hash className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}
