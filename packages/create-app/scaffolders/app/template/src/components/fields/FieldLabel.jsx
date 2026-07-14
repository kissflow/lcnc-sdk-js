export function FieldLabel({
  field,
  htmlFor,
  className = "block text-sm font-semibold text-foreground",
  children
}) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {field.Name}
      {field.Required && <span className="text-destructive ml-1">*</span>}
      {children}
    </label>
  );
}
