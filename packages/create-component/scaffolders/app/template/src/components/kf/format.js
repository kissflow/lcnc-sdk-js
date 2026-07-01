// Render Kissflow values that aren't plain strings (geolocation, currency, user,
// lookup, attachment) sensibly instead of "[object Object]".
export function formatCell(v) {
  if (v == null || v === "") return "—";
  if (typeof v !== "object") return String(v);
  const lat = v.Latitude ?? v.lat ?? v.latitude;
  const lng = v.Longitude ?? v.lng ?? v.longitude;
  if (lat != null && lng != null) return `${(+lat).toFixed(3)}, ${(+lng).toFixed(3)}`;
  if (v.Name) return String(v.Name);
  if (v.value != null) return String(v.value);
  if (v.display ?? v.Display) return String(v.display ?? v.Display);
  if (Array.isArray(v)) return v.map(formatCell).join(", ");
  return JSON.stringify(v);
}
