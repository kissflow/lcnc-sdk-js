import { KfLink, useKf } from "@kissflow/app-ui";

import { AppShell } from "../components/app-shell.jsx";
import { contacts } from "../data/contacts.js";

// src/pages/index.jsx → route "/"
export default function Dashboard() {
  const kf = useKf();
  const firstName = kf.user?.Name?.split(" ")[0];

  const stats = [
    { label: "Contacts", value: contacts.length },
    { label: "Active deals", value: 12 },
    { label: "Pipeline", value: "$48.2k" },
    { label: "Win rate", value: "63%" },
  ];

  return (
    <AppShell title="Dashboard">
      <p className="greeting">
        Welcome back{firstName ? `, ${firstName}` : ""} 👋
      </p>

      <div className="cards">
        {stats.map((s) => (
          <div className="card stat" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-head">
        <h2>Recent contacts</h2>
        <KfLink to="/contacts" className="link">
          View all →
        </KfLink>
      </div>

      <div className="list">
        {contacts.slice(0, 4).map((c) => (
          <KfLink key={c.id} to={`/contacts/${c.id}`} className="list-row">
            <span className="avatar" style={{ background: c.color }}>
              {c.name[0]}
            </span>
            <span className="row-main">
              <strong>{c.name}</strong>
              <small>
                {c.role} · {c.company}
              </small>
            </span>
            <span className={`badge ${c.status}`}>{c.status}</span>
          </KfLink>
        ))}
      </div>
    </AppShell>
  );
}
