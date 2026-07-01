import { TONES, toneAt } from "./tones.js";
import { CountUp } from "./fx.jsx";

const tc = (t) => (t ? TONES[t] || t : TONES.indigo);

/** Compact metric tile with optional delta. */
export function StatTile({ label, value, delta, deltaDir = "up", icon, tone = "indigo" }) {
  return (
    <div className="kf-stattile">
      {icon != null && <span className="kf-stattile-ic" style={{ background: tc(tone) }}>{icon}</span>}
      <div className="kf-stattile-v"><CountUp value={value} /></div>
      <div className="kf-stattile-l">{label}</div>
      {delta != null && <span className={"kf-stattile-d " + (deltaDir === "down" ? "down" : "up")}>{deltaDir === "down" ? "▼" : "▲"} {delta}</span>}
    </div>
  );
}

/** List of labelled progress bars. items: [{label, value, max?, display?, color?}]. */
export function ProgressList({ items = [] }) {
  if (!items.length) return <p className="kf-note">No items.</p>;
  return (
    <div className="kf-proglist">
      {items.map((it, i) => {
        const pct = it.max ? Math.round((Number(it.value) / it.max) * 100) : Number(it.value);
        return (
          <div className="kf-proglist-row" key={i}>
            <div className="kf-proglist-top"><span>{it.label}</span><b>{it.display ?? `${pct}%`}</b></div>
            <div className="kf-proglist-bar"><span style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: it.color || toneAt(i) }} /></div>
          </div>
        );
      })}
    </div>
  );
}

/** Vertical activity feed. items: [{title, meta?, time?, color?}]. */
export function ActivityFeed({ items = [] }) {
  if (!items.length) return <p className="kf-note">No recent activity.</p>;
  return (
    <ul className="kf-feed">
      {items.map((it, i) => (
        <li className="kf-feed-item" key={i}>
          <span className="kf-feed-dot" style={{ background: it.color || toneAt(i) }} />
          <div className="kf-feed-body">
            <strong>{it.title}</strong>
            {it.meta && <span className="kf-feed-meta">{it.meta}</span>}
          </div>
          {it.time && <span className="kf-feed-time">{it.time}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Status chip. */
export function StatusPill({ label, tone = "indigo" }) {
  return <span className="kf-pill" style={{ "--kf-tone": tc(tone) }}>{label}</span>;
}

/** Tinted callout / banner. */
export function Callout({ title, tone = "indigo", icon, children }) {
  return (
    <div className="kf-callout" style={{ "--kf-tone": tc(tone) }}>
      {icon != null && <span className="kf-callout-ic">{icon}</span>}
      <div>{title && <strong>{title}</strong>}{children && <div className="kf-callout-body">{children}</div>}</div>
    </div>
  );
}

/** Horizontal step indicator. steps: [{label, state: 'done'|'current'|'todo'}]. */
export function Stepper({ steps = [] }) {
  return (
    <div className="kf-stepper">
      {steps.map((s, i) => (
        <div className={"kf-step " + (s.state || "todo")} key={i}>
          <span className="kf-step-dot">{s.state === "done" ? "✓" : i + 1}</span>
          <span className="kf-step-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Honest empty state. */
export function EmptyState({ title = "Nothing here yet", hint, icon = "◍" }) {
  return (
    <div className="kf-empty">
      <span className="kf-empty-ic">{icon}</span>
      <strong>{title}</strong>
      {hint && <p>{hint}</p>}
    </div>
  );
}
