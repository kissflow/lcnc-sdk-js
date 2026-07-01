import { TONES } from "./tones.js";
import { CountUp } from "./fx.jsx";

export function KpiRow({ children }) {
  return <div className="kf kf-kpis">{children}</div>;
}

function Sparkline({ data, up }) {
  const w = 96, h = 40;
  const max = Math.max(...data), min = Math.min(...data), rng = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / rng) * h * 0.85 - 3}`).join(" ");
  return (
    <svg className="kf-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={up ? "#8b5cf6" : "#f97316"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Stat card. Simple style (chip + value + label) by default; when `change` is given
 * it renders the analytics style: label, value + trend badge, compare text, sparkline.
 */
export function KpiCard({ label, value = "—", tone = "indigo", icon = "◆", change, trend = "up", compare, spark }) {
  const up = trend !== "down";

  if (change || spark) {
    return (
      <div className="kf-kpi kf-kpi-analytics" style={{ "--kf-tone": TONES[tone] || tone }}>
        <div className="kf-kpi-label">{label}</div>
        <div className="kf-kpi-mid">
          <div className="kf-kpi-num"><CountUp value={value} /></div>
          {change && <span className={`kf-trend ${up ? "up" : "down"}`}>{up ? "↑" : "↓"} {change}</span>}
          {spark && <span className="kf-kpi-spark-wrap"><Sparkline data={spark} up={up} /></span>}
        </div>
        {compare && <div className="kf-kpi-compare">{compare}</div>}
      </div>
    );
  }

  return (
    <div className="kf-kpi" style={{ "--kf-tone": TONES[tone] || tone }}>
      <div className="kf-kpi-chip">{icon}</div>
      <div className="kf-kpi-value"><CountUp value={value} /></div>
      <div className="kf-kpi-label">{label}</div>
    </div>
  );
}
