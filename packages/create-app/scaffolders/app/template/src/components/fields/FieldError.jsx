import { CircleAlertIcon } from "lucide-react";

export function FieldError({ error }) {
  if (!error) return null;
  return (
    <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
      <CircleAlertIcon className="w-4 h-4" />
      {Array.isArray(error) ? error[0] : error}
    </p>
  );
}
