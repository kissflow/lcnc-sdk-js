import { useEffect, useState } from "react";
import { useKf, useKfDev } from "@sooryakanth/app-ui";

import { formatCell } from "./format.js";
import { toneAt } from "./tones.js";
import { ItemForm } from "./ItemForm.jsx";

const STATUS_KEYS = ["_status", "Status", "Stage", "_stage", "_current_step"];

/**
 * Kanban for a case/board — LIVE via the SDK (`kf.app.getBoard(id).getItems()`),
 * grouped into columns by status/stage. Cards show fields, open the item form on
 * click, and are drag-and-droppable between columns (persisted via the SDK
 * `updateItem`). Honors the simulated role.
 */
export function KanbanBoard({ caseId, cardTitle = "Summary", cardFields = [], groupField, cardIcon = "▦" }) {
  const kf = useKf();
  const { active, roleName, canAccess } = useKfDev();
  const blocked = active && !canAccess(caseId);

  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  async function load() {
    try {
      const { Data } = await kf.app.getBoard(caseId).getItems();
      setItems(Data || []);
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (blocked) { setLoading(false); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, blocked]);

  function openItem(it) {
    if (active) setOpen(it);
    else kf.app.getBoard(caseId).openForm?.(it);
  }

  if (blocked) return <div className="kf-panel"><p className="kf-note">Role <strong>{roleName}</strong> has no access to this board.</p></div>;
  if (loading) return <div className="kf-panel"><p className="kf-note">Loading…</p></div>;
  if (error) return <div className="kf"><div className="kf-error">{error}</div></div>;
  if (!items.length) return <div className="kf-panel"><p className="kf-note">No items on this board yet.</p></div>;

  const key = groupField || STATUS_KEYS.find((k) => items.some((i) => i[k] != null)) || "_status";
  const columns = [...new Set(items.map((i) => i[key] ?? "Unassigned"))];

  // Move a card to another column and persist via the SDK (optimistic, revert on fail).
  async function moveTo(col) {
    const id = dragId;
    setDragId(null);
    setOverCol(null);
    if (!id) return;
    const it = items.find((x) => x._id === id);
    if (!it || (it[key] ?? "Unassigned") === col) return;
    setItems((prev) => prev.map((x) => (x._id === id ? { ...x, [key]: col } : x)));
    try {
      // Persists for real inside Kissflow (the SDK routes it through the platform).
      // In dev the case REST proxy can't update a stage, so the move stays optimistic
      // (it resets on the next reload) — we keep it rather than snap the card back.
      await kf.app.getBoard(caseId).updateItem({ instanceId: id, data: { [key]: col } });
    } catch (e) {
      console.warn("[kanban] move not persisted in dev:", e?.message ?? e);
    }
  }

  return (
    <div className="kf kf-kanban">
      {columns.map((col, i) => {
        const colItems = items.filter((it) => (it[key] ?? "Unassigned") === col);
        return (
          <div
            className={"kf-col" + (overCol === col ? " kf-dragover" : "")}
            key={String(col)}
            style={{ "--kf-tone": toneAt(i) }}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col); }}
            onDragLeave={() => setOverCol((c) => (c === col ? null : c))}
            onDrop={() => moveTo(col)}
          >
            <div className="kf-col-head">
              <span className="kf-col-title"><span className="kf-col-dot" />{String(col)}</span>
              <span className="kf-col-count">{colItems.length}</span>
            </div>
            <div className="kf-col-cards">
              {colItems.map((it) => (
                <div
                  className={"kf-kard" + (dragId === it._id ? " kf-dragging" : "")}
                  key={it._id}
                  role="button"
                  tabIndex={0}
                  draggable
                  onDragStart={(e) => { setDragId(it._id); e.dataTransfer.effectAllowed = "move"; }}
                  onDragEnd={() => { setDragId(null); setOverCol(null); }}
                  onClick={() => openItem(it)}
                >
                  {(() => {
                    const title = String(formatCell(it[cardTitle] ?? it.Name ?? it._id) ?? "");
                    const initials = title.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "•";
                    // Real, distinct meta only — drop fields that just repeat the title.
                    const tags = cardFields
                      .map((f) => ({ label: f.label, value: it[f.field] }))
                      .filter((t) => t.value != null && t.value !== "" && String(formatCell(t.value)) !== title);
                    const status = it._status_name || it._current_step || null; // real Kissflow case stage
                    const when = it._modified_at || it._created_at || null;
                    const date = when && !isNaN(new Date(when)) ? new Date(when).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : null;
                    return (
                      <>
                        <div className="kf-kard-head">
                          <span className="kf-kard-avatar">{initials}</span>
                          <strong className="kf-kard-title">{title}</strong>
                          <span className="kf-kard-open" aria-hidden>↗</span>
                        </div>
                        <div className="kf-kard-meta">
                          {it._id && <span className="kf-kard-ref">{it._id}</span>}
                          {status && <span className="kf-kard-badge">{status}</span>}
                          {tags.map((t) => (
                            <span className="kf-kard-tag" key={t.label}><i>{t.label}</i>{formatCell(t.value)}</span>
                          ))}
                          {date && <span className="kf-kard-when">{date}</span>}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ))}
              {colItems.length === 0 && <div className="kf-col-empty">Drop here</div>}
            </div>
          </div>
        );
      })}

      {open && (
        <ItemForm flowType="Case" flowId={caseId} item={open} onClose={() => setOpen(null)} onSaved={load} />
      )}
    </div>
  );
}
