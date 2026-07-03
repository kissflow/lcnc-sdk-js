/**
 * Dev-only overlay shown when the app runs OUTSIDE Kissflow (offline mock mode).
 * Lets you switch the active app role so you can check how screens behave per role.
 * Self-contained inline styles — no dependency on the host app's CSS.
 */
import type { KfSchemaRole } from "./schema";

interface RoleSwitcherProps {
  roles: KfSchemaRole[];
  activeId: string | null;
  onChange: (roleId: string) => void;
  appId?: string;
  /** "offline" = mock data; "live" = real dev data via the proxy. */
  mode?: "offline" | "live";
}

export function RoleSwitcher({ roles, activeId, onChange, appId, mode = "offline" }: RoleSwitcherProps) {
  const live = mode === "live";
  return (
    <div style={wrap} data-kf-offline="" data-kf-mode={mode}>
      <span
        style={{ ...dot, background: live ? "#22c55e" : "#f59e0b", boxShadow: `0 0 0 3px ${live ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.25)"}` }}
        title={live ? "Running outside Kissflow against live dev data" : "Running outside Kissflow (mock data)"}
      />
      <span style={label}>
        {live ? "live dev" : "offline"}{appId ? ` · ${appId}` : ""}
      </span>
      {roles.length > 0 && (
        <label style={pickWrap}>
          <span style={pickLabel}>Role</span>
          <select
            value={activeId ?? ""}
            onChange={(e) => onChange(e.target.value)}
            style={select}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

const wrap: React.CSSProperties = {
  position: "fixed",
  bottom: 16,
  right: 16,
  zIndex: 2147483647,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 12px",
  borderRadius: 9999,
  background: "rgba(17,24,39,0.92)",
  color: "#fff",
  font: "12px/1.2 ui-sans-serif, system-ui, -apple-system, sans-serif",
  boxShadow: "0 6px 24px rgba(0,0,0,0.28)",
  backdropFilter: "blur(6px)",
};
const dot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#f59e0b",
  boxShadow: "0 0 0 3px rgba(245,158,11,0.25)",
};
const label: React.CSSProperties = { opacity: 0.85, letterSpacing: 0.2 };
const pickWrap: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6 };
const pickLabel: React.CSSProperties = { opacity: 0.6 };
const select: React.CSSProperties = {
  background: "#fff",
  color: "#111827",
  border: "none",
  borderRadius: 6,
  padding: "3px 6px",
  font: "inherit",
  cursor: "pointer",
};
