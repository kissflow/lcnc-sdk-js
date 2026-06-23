import { useState } from "react";
import { KfLink, usePageTitle } from "@kissflow/app-ui";

import { contacts } from "../../data/contacts.js";

// src/pages/contacts/index.jsx → route "/contacts"
export default function Contacts() {
  usePageTitle("Contacts");
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const filtered = term
    ? contacts.filter((c) =>
        `${c.name} ${c.company} ${c.role}`.toLowerCase().includes(term),
      )
    : contacts;

  return (
    <>
      <input
        className="search"
        type="search"
        placeholder="Search by name, company, or role…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="list">
        {filtered.map((c) => (
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
            <span className="chev">›</span>
          </KfLink>
        ))}
        {filtered.length === 0 && (
          <p className="empty">No contacts match “{query}”.</p>
        )}
      </div>
    </>
  );
}
