import { TONES, toneAt } from "./tones.js";

const col = (t, i) => t ? (TONES[t] || t) : toneAt(i);
const n = (v) => { const x = parseFloat(String(v ?? "").replace(/[^0-9.\-]/g, "")); return isNaN(x) ? 0 : x; };

/** Vertical bar chart. data: [{label, value, color?}]. */
export function BarChart({ data = [], tone, height = 190, format }) {
  if (!data.length) return <p className="kf-note">No data.</p>;
  const max = Math.max(1, ...data.map((d) => n(d.value)));
  return (
    <div className="kf-barchart" style={{ height }}>
      {data.map((d, i) => (
        <div className="kf-barchart-col" key={i}>
          <div className="kf-barchart-slot">
            <span className="kf-barchart-val">{format ? format(d.value) : d.value}</span>
            <div className="kf-barchart-bar" style={{ height: `${(n(d.value) / max) * 100}%`, background: d.color || col(tone, i) }} />
          </div>
          <span className="kf-barchart-label" title={String(d.label)}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Horizontal bars (ranked). data: [{label, value, color?}]. */
export function HBars({ data = [], tone, format, max: maxRows = 8 }) {
  const rows = [...data].sort((a, b) => n(b.value) - n(a.value)).slice(0, maxRows);
  if (!rows.length) return <p className="kf-note">No data.</p>;
  const max = Math.max(1, ...rows.map((d) => n(d.value)));
  return (
    <div className="kf-hbars">
      {rows.map((d, i) => (
        <div className="kf-hbar-row" key={i}>
          <span className="kf-hbar-label" title={String(d.label)}>{d.label}</span>
          <span className="kf-hbar-track"><span className="kf-hbar-fill" style={{ width: `${(n(d.value) / max) * 100}%`, background: d.color || col(tone, i) }} /></span>
          <span className="kf-hbar-val">{format ? format(d.value) : d.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Line / area trend. data: [{label, value}]. */
export function LineChart({ data = [], tone = "indigo", area = true, height = 190, dots = true }) {
  if (data.length < 2) return <p className="kf-note">Not enough data to chart.</p>;
  const W = 100, H = 100;
  const vals = data.map((d) => n(d.value));
  const max = Math.max(...vals), min = Math.min(0, ...vals), span = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * W, H - ((n(d.value) - min) / span) * H]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(2) + " " + p[1].toFixed(2)).join(" ");
  const c = TONES[tone] || tone;
  return (
    <div className="kf-linechart" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="kf-linechart-svg">
        {area && <path d={`${line} L ${W} ${H} L 0 ${H} Z`} fill={c} opacity="0.12" />}
        <path d={line} fill="none" stroke={c} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        {dots && pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill="#fff" stroke={c} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="kf-linechart-axis">{data.map((d, i) => <span key={i}>{d.label}</span>)}</div>
    </div>
  );
}

/** Radial gauge for a single ratio. */
export function GaugeRing({ value = 0, max = 100, label, sublabel, tone = "indigo", size = 150 }) {
  const pct = Math.max(0, Math.min(1, n(value) / (n(max) || 1)));
  const r = 54, circ = 2 * Math.PI * r, c = TONES[tone] || tone;
  return (
    <div className="kf-gauge" style={{ width: size }}>
      <svg viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#eef0f5" strokeWidth="14" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={c} strokeWidth="14" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset .5s ease" }} />
        <text x="70" y="72" textAnchor="middle" className="kf-gauge-val">{Math.round(pct * 100)}%</text>
        {sublabel && <text x="70" y="90" textAnchor="middle" className="kf-gauge-sub">{sublabel}</text>}
      </svg>
      {label && <div className="kf-gauge-label">{label}</div>}
    </div>
  );
}

/** Funnel of descending stages. data: [{label, value, color?}]. */
export function FunnelChart({ data = [], format }) {
  if (!data.length) return <p className="kf-note">No data.</p>;
  const max = Math.max(1, ...data.map((d) => n(d.value)));
  return (
    <div className="kf-funnel">
      {data.map((d, i) => (
        <div className="kf-funnel-row" key={i}>
          <span className="kf-funnel-label" title={String(d.label)}>{d.label}</span>
          <div className="kf-funnel-track">
            <div className="kf-funnel-bar" style={{ width: `${Math.max(10, (n(d.value) / max) * 100)}%`, background: d.color || col(null, i) }}>
              {format ? format(d.value) : d.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Intensity heatmap of a flat series. data: [{label, value}]. */
export function Heatmap({ data = [], tone = "indigo", columns = 7 }) {
  if (!data.length) return <p className="kf-note">No data.</p>;
  const max = Math.max(1, ...data.map((d) => n(d.value)));
  const c = TONES[tone] || tone;
  return (
    <div className="kf-heatmap" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {data.map((d, i) => (
        <div className="kf-heatmap-cell" key={i} title={`${d.label}: ${d.value}`}
          style={{ background: `color-mix(in srgb, ${c} ${Math.round((n(d.value) / max) * 100)}%, #eef0f5)` }} />
      ))}
    </div>
  );
}

/** Stacked horizontal bars. data: [{label, ...keyed values}]. keys: [{key,label,color?}]. */
export function StackedBar({ data = [], keys = [] }) {
  if (!data.length || !keys.length) return <p className="kf-note">No data.</p>;
  return (
    <div className="kf-stackbar">
      {data.map((row, i) => {
        const total = keys.reduce((s, k) => s + n(row[k.key]), 0) || 1;
        return (
          <div className="kf-stackbar-row" key={i}>
            <span className="kf-stackbar-label" title={String(row.label)}>{row.label}</span>
            <div className="kf-stackbar-track">
              {keys.map((k, j) => { const v = n(row[k.key]); return v ? <span key={j} className="kf-stackbar-seg" style={{ width: `${(v / total) * 100}%`, background: k.color || col(null, j) }} title={`${k.label || k.key}: ${v}`} /> : null; })}
            </div>
          </div>
        );
      })}
      <div className="kf-stackbar-legend">{keys.map((k, j) => <span key={j}><i style={{ background: k.color || col(null, j) }} />{k.label || k.key}</span>)}</div>
    </div>
  );
}
