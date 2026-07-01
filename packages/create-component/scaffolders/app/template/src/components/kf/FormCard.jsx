import { useEffect, useState } from "react";
import { useKf, useKfDev } from "@sooryakanth/app-ui";

import { FieldInput } from "./FieldInput.jsx";
import { toast } from "./fx.jsx";

const handle = (kf, type, id) =>
  type === "Process" ? kf.app.getProcess(id) : type === "Case" ? kf.app.getBoard(id) : kf.app.getDataform(id);

/** A create form for a model — fields pulled live, submits via createItem. Role-gated. */
export function FormCard({ flowType = "Form", flowId, title = "Create record", max = 6, onCreated }) {
  const kf = useKf();
  const { active, roleName, canAccess } = useKfDev();
  const blocked = active && !canAccess(flowId);

  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (blocked) return;
    let alive = true;
    (async () => {
      try {
        const cols = await handle(kf, flowType, flowId).getFields();
        if (alive) setFields((cols || []).filter((c) => !c.IsInternal && !c.IsSystemField).slice(0, max));
      } catch { /* ignore */ }
    })();
    return () => { alive = false; };
  }, [flowId, flowType, blocked]); // eslint-disable-line react-hooks/exhaustive-deps

  if (blocked) return <div className="kf-panel"><p className="kf-note">Role <strong>{roleName}</strong> can’t create here.</p></div>;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await handle(kf, flowType, flowId).createItem({ data: values });
      setValues({});
      toast("Record created");
      onCreated?.();
    } catch (err) {
      setMsg(String(err?.message ?? err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="kf kf-panel" onSubmit={submit} style={{ padding: 18 }}>
      <h3 className="kf-section-title">{title}</h3>
      <div className="kf-form-grid">
        {fields.map((f) => (
          <label key={f.Id} className="kf-field">
            <span>{f.Name}{f.Required ? " *" : ""}</span>
            <FieldInput field={f} value={values[f.Id]} onChange={(v) => setValues((vals) => ({ ...vals, [f.Id]: v }))} />
          </label>
        ))}
      </div>
      <div style={{ marginTop: 4 }}>
        <button className="kf-btn" disabled={busy}>{busy ? "Saving…" : "Create"}</button>
        {msg && <span className="kf-muted" style={{ marginLeft: 12 }}>{msg}</span>}
      </div>
    </form>
  );
}
