import { Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "./FieldLabel.jsx";

export function SequenceNumberField({ field, value }) {
  return (
    <div className="space-y-2">
      <FieldLabel field={field} htmlFor={field.Id} />
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
