// Dashboard building blocks tuned to match a Kissflow app dashboard:
// filter bar, donut, "no access" block, a stores map placeholder, and a big stat.
import { TONES } from "./tones.js";

const DEFAULT_FILTERS = [
  { label: "State", options: ["All states"] },
  { label: "District", options: ["All Cities"] },
  { label: "Store", options: ["All Categories"] },
  { label: "Category", options: ["All Brands"] },
  { label: "Month", options: ["All months"] },
];

export function FilterBar({ filters = DEFAULT_FILTERS }) {
  return (
    <div className="kf kf-filterbar">
      {filters.map((f) => (
        <label key={f.label} className="kf-filter">
          <span>{f.label}</span>
          <select>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
        </label>
      ))}
    </div>
  );
}

// Minimal "restricted" state for a component the role can't see.
export function NoAccess({ label = "Restricted" }) {
  return (
    <div className="kf-noaccess">
      <span className="kf-noaccess-ic">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </span>
      <p>{label}</p>
      <span className="kf-noaccess-sub">You don’t have access to this component</span>
    </div>
  );
}

// SVG donut. segments: [{ value, color }]
export function Donut({ segments, size = 140, thickness = 20, center }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="kf-donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef0f4" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const len = (s.value / total) * c;
            const el = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += len;
            return el;
          })}
        </g>
      </svg>
      {center != null && <div className="kf-donut-center">{center}</div>}
    </div>
  );
}

export function Legend({ items }) {
  return (
    <div className="kf-legend">
      {items.map((it) => (
        <div className="kf-legend-row" key={it.label}>
          <span className="kf-legend-dot" style={{ background: it.color }} />
          <strong>{it.value}</strong> <span className="kf-muted">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

export function BigStat({ value, tone = "rose", gradient }) {
  return (
    <div className={"kf-bigstat" + (gradient ? " kf-gradient" : "")} style={gradient ? undefined : { color: TONES[tone] || tone }}>
      {value}
    </div>
  );
}

// Outlined pill buttons (Select Dates / Filter) like the reference header.
export function GhostButton({ children }) {
  return <button className="kf-btn kf-btn-ghost kf-ghost-pill">{children}</button>;
}

export function ProgressBar({ value = 0, tone = "indigo" }) {
  return (
    <div className="kf-progress" style={{ "--kf-tone": TONES[tone] || tone }}>
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

// Horizontal segmented bar (pipeline/stage breakdown). segments: [{label,value,color}]
export function SegmentBar({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="kf-segwrap">
      <div className="kf-segbar">
        {segments.map((s, i) =>
          s.value > 0 ? (
            <span key={i} className="kf-seg" style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={`${s.label}: ${s.value}`} />
          ) : null,
        )}
      </div>
      <div className="kf-seg-legend">
        {segments.map((s, i) => (
          <div className="kf-seg-li" key={i}>
            <span className="kf-seg-dot" style={{ background: s.color }} />
            <strong>{s.value}</strong> <span className="kf-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

