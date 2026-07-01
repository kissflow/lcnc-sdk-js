import { useEffect, useState } from "react";
import { useKf, useKfDev } from "@sooryakanth/app-ui";

import { formatCell } from "./format.js";
import { ItemForm } from "./ItemForm.jsx";
import { Skeleton } from "./fx.jsx";

const handle = (kf, type, id) =>
  type === "Process" ? kf.app.getProcess(id) : type === "Case" ? kf.app.getBoard(id) : kf.app.getDataform(id);

/**
 * Live data table for a flow (form/process/case). Rows are clickable — clicking one
 * opens that item's form (ItemForm). Honors the simulated role.
 */
export function DataTable({ flowType = "Form", flowId, view, max = 6 }) {
  const kf = useKf();
  const { active, roleName, canAccess } = useKfDev();
  const blocked = active && !canAccess(flowId);

  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null); // item whose form is open (dev)

  // Inside Kissflow → open the native form via the SDK (openForm). In dev (no
  // Kissflow parent) → open the reconstructed ItemForm modal.
  function openItem(r) {
    if (active) setOpen(r);
    else handle(kf, flowType, flowId).openForm?.(r);
  }

  async function load() {
    try {
      const { Data, Columns } = await handle(kf, flowType, flowId).getItems(view ? { view } : {});
      setRows(Data || []);
      setCols((Columns || []).filter((c) => !c.IsInternal).slice(0, max));
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
  }, [flowId, flowType, view, blocked]);

  if (blocked) return <div className="kf-panel"><p className="kf-note">Role <strong>{roleName}</strong> has no access to this data.</p></div>;
  if (loading) return <div className="kf-panel"><Skeleton rows={5} /></div>;
  if (error) return <div className="kf"><div className="kf-error">{error}</div></div>;
  if (!rows.length) return <div className="kf-panel"><p className="kf-note">No records.</p></div>;

  return (
    <div className="kf kf-panel">
      <table className="kf-table">
        <thead>
          <tr>{cols.map((c) => <th key={c.Id}>{c.Name}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="kf-row" onClick={() => openItem(r)}>
              {cols.map((c) => <td key={c.Id}>{formatCell(r[c.Id])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <ItemForm
          flowType={flowType}
          flowId={flowId}
          item={open}
          onClose={() => setOpen(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
