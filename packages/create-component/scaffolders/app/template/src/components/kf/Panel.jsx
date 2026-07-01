// Titled section: heading above a glass card. Nested panels (DataTable/Chart, which
// bring their own .kf-panel) are flattened by CSS so cards don't double up.
export function Panel({ title, action, children }) {
  return (
    <section className="kf kf-panel-sec">
      {(title || action) && (
        <div className="kf-head" style={{ marginBottom: 12, alignItems: "center" }}>
          {title ? <h3 className="kf-section-title">{title}</h3> : <span />}
          {action}
        </div>
      )}
      <div className="kf-panel">{children}</div>
    </section>
  );
}

// Simple responsive grid for laying out panels side by side.
export function Grid({ cols = 2, children }) {
  return (
    <div className="kf" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: "var(--kf-gap, 16px)", marginBottom: 22 }}>
      {children}
    </div>
  );
}
