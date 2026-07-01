import { useEffect, useState } from "react";
import { useKf, useKfDev } from "@sooryakanth/app-ui";

import { toneAt } from "./tones.js";
import { formatCell } from "./format.js";

const handle = (kf, type, id) =>
  type === "Process" ? kf.app.getProcess(id) : type === "Case" ? kf.app.getBoard(id) : kf.app.getDataform(id);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Gantt-style task timeline. Uses the items' start/end date fields when available;
// otherwise lays each task across a rolling window so the timeline is always legible.
export function Timeline({
  flowType = "Case",
  flowId,
  view,
  titleField = "Summary",
  startField,
  endField,
  span = 6,
  startMonth = 0,
  max = 8,
}) {
  const kf = useKf();
  const { active, canAccess } = useKfDev();
  const blocked = active && !canAccess(flowId);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blocked) { setLoading(false); return; }
    let alive = true;
    (async () => {
      try {
        const { Data } = await handle(kf, flowType, flowId).getItems(view ? { view } : {});
        if (alive) setItems(Data || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [flowId, flowType, view, blocked]); // eslint-disable-line react-hooks/exhaustive-deps

  if (blocked) return <p className="kf-note">Restricted.</p>;
  if (loading) return <p className="kf-note">Loading…</p>;
  if (!items.length) return <p className="kf-note">No tasks to schedule.</p>;

  const months = Array.from({ length: span }, (_, i) => MONTHS[(startMonth + i) % 12]);
  const monthOf = (v) => { const d = v ? new Date(v) : null; return d && !isNaN(d) ? d.getMonth() : null; };

  // Only items with real start dates — no synthetic positions.
  const rows = items
    .map((it, i) => {
      const start = startField ? monthOf(it[startField]) : null;
      if (start == null) return null;
      let end = endField ? monthOf(it[endField]) : null;
      if (end == null || end <= start) end = Math.min(span - 1, start + 1);
      return {
        title: formatCell(it[titleField] ?? it.Name ?? it._id),
        left: (start / span) * 100,
        width: ((end - start + 1) / span) * 100,
        i,
      };
    })
    .filter(Boolean)
    .slice(0, max);

  if (!rows.length) return <p className="kf-note">No scheduled dates on these items yet.</p>;

  return (
    <div className="kf-timeline">
      <div className="kf-tl-axis">
        <span className="kf-tl-label" />
        <div className="kf-tl-months">
          {months.map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
      {rows.map((r) => (
        <div className="kf-tl-row" key={r.i}>
          <span className="kf-tl-label" title={r.title}>{r.title}</span>
          <div className="kf-tl-track" style={{ "--kf-span": span }}>
            <span className="kf-tl-bar" style={{ left: `${r.left}%`, width: `${r.width}%`, background: toneAt(r.i) }} />
          </div>
        </div>
      ))}
    </div>
  );
}
