import { useEffect, useState } from "react";
import { useKf } from "@sooryakanth/app-ui";

import { formatCell } from "./format.js";
import { FieldInput } from "./FieldInput.jsx";

const handle = (kf, type, id) =>
  type === "Process" ? kf.app.getProcess(id) : type === "Case" ? kf.app.getBoard(id) : kf.app.getDataform(id);

/**
 * Modal that opens an existing item's form: loads the item's real field values,
 * lets you edit + Save (updateItem), and — for process tasks — Submit (submitItem).
 * Rendered by DataTable when a row is clicked.
 */
export function ItemForm({ flowType = "Form", flowId, item, onClose, onSaved }) {
  const kf = useKf();
  const h = handle(kf, flowType, flowId);
  const idArg = flowType === "Form" ? { itemId: item._id } : { instanceId: item._id };

  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const cols = await h.getFields().catch(() => []);
      const full = await h.getItem(idArg).catch(() => item);
      if (!alive) return;
      const fs = (cols || []).filter((c) => !c.IsInternal && !c.IsSystemField).slice(0, 14);
      setFields(fs);
      setValues(Object.fromEntries(fs.map((f) => [f.Id, full?.[f.Id] ?? ""])));
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    setBusy(true); setMsg(null);
    try {
      await h.updateItem({ ...idArg, activityInstanceId: item._activity_instance_id, data: values });
      setMsg("Saved ✓");
      onSaved?.();
    } catch (e) { setMsg(String(e?.message ?? e)); } finally { setBusy(false); }
  }

  async function submit() {
    setBusy(true); setMsg(null);
    try {
      await h.submitItem({ instanceId: item._id, activityInstanceId: item._activity_instance_id });
      setMsg("Submitted ✓");
      onSaved?.();
      onClose?.();
    } catch (e) { setMsg(String(e?.message ?? e)); } finally { setBusy(false); }
  }

  return (
    <div className="kf-modal-backdrop" onClick={onClose}>
      <div className="kf kf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kf-modal-head">
          <h3>{formatCell(item.Name ?? item._id)}</h3>
          <button className="kf-x" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="kf-dev-note">
          Dev preview — the native Kissflow form (with validations &amp; field
          permissions) opens via the SDK <code>openForm()</code> inside Kissflow.
        </div>

        {loading ? (
          <p className="kf-note">Loading…</p>
        ) : (
          <>
            <div className="kf-form-grid">
              {fields.map((f) => (
                <label key={f.Id} className="kf-field">
                  <span>{f.Name}{f.Required ? " *" : ""} <em className="kf-field-type">{f.Type}</em></span>
                  <FieldInput field={f} value={values[f.Id]} onChange={(v) => setValues((vals) => ({ ...vals, [f.Id]: v }))} />
                </label>
              ))}
            </div>
            <div className="kf-modal-foot">
              <button className="kf-btn" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
              {flowType === "Process" && item._activity_instance_id && (
                <button className="kf-btn kf-btn-ghost" onClick={submit} disabled={busy}>Submit</button>
              )}
              {msg && <span className="kf-muted" style={{ marginLeft: 4 }}>{msg}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
