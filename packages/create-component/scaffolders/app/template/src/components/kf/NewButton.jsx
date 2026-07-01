import { useState } from "react";
import { useKf, useKfDev } from "@sooryakanth/app-ui";

import { FormCard } from "./FormCard.jsx";

const handle = (kf, type, id) =>
  type === "Process" ? kf.app.getProcess(id) : type === "Case" ? kf.app.getBoard(id) : kf.app.getDataform(id);

/**
 * "+ New" action that opens a blank create form.
 * - Inside Kissflow → `createItem()` to make a draft, then `openForm(draft)` opens the
 *   NATIVE form (full validations + field permissions). This is the deployed behavior.
 * - In dev (no Kissflow parent) → a reconstructed create form in a modal.
 */
export function NewButton({ flowType = "Form", flowId, label = "New", onCreated }) {
  const kf = useKf();
  const { active } = useKfDev();
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onNew() {
    if (active) { setShowModal(true); return; }
    setBusy(true);
    try {
      const h = handle(kf, flowType, flowId);
      const draft = await h.createItem(); // blank draft
      await h.openForm?.(draft); // native form opens on it
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="kf-btn" onClick={onNew} disabled={busy}>+ {label}</button>
      {showModal && (
        <div className="kf-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="kf kf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="kf-modal-head">
              <h3>{label}</h3>
              <button className="kf-x" onClick={() => setShowModal(false)} aria-label="Close">✕</button>
            </div>
            <div className="kf-dev-note">
              Dev preview — once deployed, the native Kissflow form opens via
              <code>createItem()</code> + <code>openForm()</code>.
            </div>
            <FormCard flowType={flowType} flowId={flowId} title="" onCreated={() => { setShowModal(false); onCreated?.(); }} />
          </div>
        </div>
      )}
    </>
  );
}
