// Placeholder for a Kissflow custom component (external React app). We can't load
// the original here, so this marks the slot — drop your own component in its place.
export function CustomEmbed({ componentId, label = "Custom component" }) {
  return (
    <div className="kf kf-panel" style={{ padding: 28, textAlign: "center" }}>
      <div className="kf-note">
        <div style={{ fontSize: 22, marginBottom: 6 }}>⬡</div>
        <strong>{label}</strong>
        {componentId && <div style={{ fontSize: 11, marginTop: 2 }}>{componentId}</div>}
        <div style={{ fontSize: 11, marginTop: 6, opacity: 0.8 }}>
          External custom component — build your own React here.
        </div>
      </div>
    </div>
  );
}
