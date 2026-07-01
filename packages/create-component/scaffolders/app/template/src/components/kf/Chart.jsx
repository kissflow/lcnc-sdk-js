import { useEffect, useState } from "react";
import { useKf, useKfDev } from "@sooryakanth/app-ui";

import { toneAt } from "./tones.js";

const handle = (kf, type, id) =>
  type === "Process" ? kf.app.getProcess(id) : type === "Case" ? kf.app.getBoard(id) : kf.app.getDataform(id);

/**
 * Dependency-light, vibrant bar chart: aggregates a model's records by a category
 * field and draws gradient bars. Falls back to a clean empty state. Role-gated.
 */
export function Chart({ title, flowType = "Form", flowId, groupBy }) {
  const kf = useKf();
  const { active, canAccess } = useKfDev();
  const blocked = active && !canAccess(flowId);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (blocked) { setLoading(false); return; }
    let alive = true;
    (async () => {
      try {
        const { Data, Columns } = await handle(kf, flowType, flowId).getItems();
        if (!alive) return;
        const key =
          groupBy ||
          (Columns || []).find((c) => !c.IsInternal && /select|status|text/i.test(c.Type))?.Id ||
          (Columns || [])[0]?.Id;
        const counts = {};
        (Data || []).forEach((r) => {
          const raw = r[key];
          const k = String((raw && (raw.Name ?? raw.value)) ?? raw ?? "—");
          counts[k] = (counts[k] || 0) + 1;
        });
        setData(Object.entries(counts).map(([label, value]) => ({ label, value })));
      } catch (e) {
        if (alive) setError(String(e?.message ?? e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [flowId, flowType, blocked]); // eslint-disable-line react-hooks/exhaustive-deps

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="kf kf-panel" style={{ padding: 18 }}>
      {title && <h3 className="kf-section-title">{title}</h3>}
      {blocked ? (
        <p className="kf-note">No access to this data.</p>
      ) : loading ? (
        <p className="kf-note">Loading…</p>
      ) : error ? (
        <div className="kf-error">{error}</div>
      ) : !data.length ? (
        <p className="kf-note">No data for this chart yet.</p>
      ) : (
        <div className="kf-bars">
          {data.slice(0, 8).map((d, i) => (
            <div className="kf-bar-row" key={d.label}>
              <span className="kf-bar-label" title={d.label}>{d.label}</span>
              <span className="kf-bar-track">
                <span className="kf-bar-fill" style={{ width: `${(d.value / max) * 100}%`, "--kf-tone": toneAt(i) }} />
              </span>
              <span className="kf-bar-val">{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
