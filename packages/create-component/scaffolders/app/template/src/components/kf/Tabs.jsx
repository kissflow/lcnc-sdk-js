import { useState } from "react";

// tabs = [{ label, content }]
export function Tabs({ tabs }) {
  const [i, setI] = useState(0);
  return (
    <div className="kf kf-tabs">
      <div className="kf-tabbar">
        {tabs.map((t, idx) => (
          <button
            key={t.label}
            className={"kf-tab" + (idx === i ? " active" : "")}
            onClick={() => setI(idx)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="kf-tabpane">{tabs[i]?.content}</div>
    </div>
  );
}
