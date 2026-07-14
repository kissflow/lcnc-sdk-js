import { useState, useEffect, useRef } from "react";
import { CheckIcon, LockIcon, Loader2Icon } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   FORM HEADER  —  Sticky top bar: title, autosave status
───────────────────────────────────────────────────────────────────────────── */

export function FormHeader({ title, isNewRecord, isSaving, isFormReadOnly }) {
  const [justSaved, setJustSaved] = useState(false);
  const wasSavingRef = useRef(false);

  // Flash a brief "Saved" confirmation in the header whenever an autosave
  // finishes (isSaving true -> false) — not tied to any one button click,
  // since every field edit persists on its own.
  useEffect(
    function flashSavedOnAutosave() {
      if (isSaving) {
        wasSavingRef.current = true;
        setJustSaved(false);
        return;
      }
      if (!wasSavingRef.current) return;
      wasSavingRef.current = false;
      setJustSaved(true);
      const timer = setTimeout(() => setJustSaved(false), 2000);
      return () => clearTimeout(timer);
    },
    [isSaving]
  );

  return (
    <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-(--color-border)">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-base font-semibold text-(--color-foreground) truncate">
            {title}
          </h1>
          {isFormReadOnly && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-(--color-border)">
              <LockIcon className="w-3 h-3" />
              Read-only
            </span>
          )}
          {isNewRecord && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info/10 text-info text-xs font-medium border border-info/40">
              New record
            </span>
          )}
          {isSaving && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium border border-warning/40">
              <Loader2Icon className="w-3 h-3 animate-spin" />
              Saving…
            </span>
          )}
          {!isSaving && justSaved && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium border border-success/40">
              <CheckIcon className="w-3 h-3" strokeWidth={2.5} />
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
