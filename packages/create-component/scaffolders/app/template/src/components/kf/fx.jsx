import { useEffect, useState } from "react";

const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

/** Counts a number up on mount (eased). Non-numeric values render as-is. */
export function CountUp({ value, duration = 750 }) {
  const target = typeof value === "number" ? value : Number(value);
  const [n, setN] = useState(reduced || isNaN(target) ? target : 0);

  useEffect(() => {
    if (reduced || isNaN(target)) { setN(target); return; }
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3)))); // ease-out-cubic
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <>{isNaN(target) ? value : n}</>;
}

/** Shimmer skeleton placeholder while data loads. */
export function Skeleton({ rows = 4 }) {
  return (
    <div className="kf-skel">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="kf-skel-row" key={i} style={{ width: `${90 - (i % 3) * 18}%` }} />
      ))}
    </div>
  );
}

// --- tiny global toast (event-bus, no provider needed) ---
const listeners = new Set();
let seq = 0;
export function toast(message, icon = "✓") {
  seq += 1;
  const t = { id: seq, message, icon };
  listeners.forEach((l) => l(t));
}

export function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const l = (t) => {
      setItems((p) => [...p, t]);
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== t.id)), 2600);
    };
    listeners.add(l);
    return () => listeners.delete(l);
  }, []);
  return (
    <div className="kf-toaster" aria-live="polite">
      {items.map((t) => (
        <div className="kf-toast" key={t.id}>
          <span className="kf-toast-ic">{t.icon}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
