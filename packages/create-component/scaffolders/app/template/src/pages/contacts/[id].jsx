import { useParams } from "react-router-dom";
import { KfLink, useKfRouter, usePageTitle } from "@kissflow/app-ui";

import { getContact } from "../../data/contacts.js";

// src/pages/contacts/[id].jsx → dynamic route "/contacts/:id"
export default function ContactDetail() {
  const { id } = useParams();
  const router = useKfRouter();
  const contact = getContact(id);
  usePageTitle(contact ? contact.name : "Contact");

  if (!contact) {
    return (
      <p className="empty">
        No contact with id “{id}”. <KfLink to="/contacts">Back to list</KfLink>
      </p>
    );
  }

  return (
    <>
      <button className="link-btn" onClick={() => router.back()}>
        ← Back
      </button>

      <div className="profile">
        <span className="avatar lg" style={{ background: contact.color }}>
          {contact.name[0]}
        </span>
        <div>
          <h2>{contact.name}</h2>
          <p className="muted">
            {contact.role} · {contact.company}
          </p>
          <span className={`badge ${contact.status}`}>{contact.status}</span>
        </div>
      </div>

      <dl className="details">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{contact.phone}</dd>
        </div>
        <div>
          <dt>Company</dt>
          <dd>{contact.company}</dd>
        </div>
      </dl>

      <p className="hint">
        This is a dynamic route (<code>/contacts/{id}</code>). Refresh the page —
        Kissflow deep-links you straight back here via the synced URL.
      </p>
    </>
  );
}
