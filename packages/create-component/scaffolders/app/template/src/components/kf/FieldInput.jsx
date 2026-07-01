import { formatCell } from "./format.js";

// Render an input appropriate to a Kissflow field's Type (from the form definition).
// Select options and layout sections aren't exposed by the field API, so selects
// fall back to text and fields render in definition order.
export function FieldInput({ field, value, onChange }) {
  const t = (field.Type || "Text").toLowerCase();
  const set = (v) => onChange(v);
  const str = typeof value === "object" && value !== null ? formatCell(value) : value ?? "";

  if (t === "textarea" || t === "multiline" || t === "richtext")
    return <textarea rows={3} value={str} onChange={(e) => set(e.target.value)} />;

  if (t === "number" || t === "currency")
    return <input type="number" value={str} onChange={(e) => set(e.target.value)} />;

  if (t === "date")
    return <input type="date" value={String(str).slice(0, 10)} onChange={(e) => set(e.target.value)} />;

  if (t === "datetime")
    return <input type="datetime-local" value={String(str).slice(0, 16)} onChange={(e) => set(e.target.value)} />;

  if (t === "yes/no" || t === "boolean")
    return (
      <label className="kf-check">
        <input type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} /> {field.Name}
      </label>
    );

  if (t === "email") return <input type="email" value={str} onChange={(e) => set(e.target.value)} />;

  // user / usergrouplist / attachment / lookup — read-only display (not editable here)
  if (["user", "usergrouplist", "attachment", "image", "remotelookup", "lookup"].includes(t))
    return <input value={str} disabled placeholder={field.Type} />;

  // select/dropdown — no options in the def, so a free-text fallback
  return <input value={str} onChange={(e) => set(e.target.value)} placeholder={t === "select" ? "Select…" : undefined} />;
}
