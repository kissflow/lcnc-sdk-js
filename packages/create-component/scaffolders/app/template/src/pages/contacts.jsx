import { Outlet } from "react-router-dom";

import { contacts } from "../data/contacts.js";

// A file named `contacts.jsx` sitting NEXT TO the `contacts/` folder becomes the
// section layout for everything under /contacts — the equivalent of Next's
// app/contacts/layout.tsx. It composes INSIDE the root AppShell layout and stays
// mounted as you move between the list (/contacts) and a detail (/contacts/:id).
export default function ContactsLayout() {
  return (
    <div className="section">
      <div className="section-bar">
        <span className="section-eyebrow">Directory</span>
        <span className="section-count">{contacts.length} contacts</span>
      </div>
      {/* the matched child route (list or detail) renders here */}
      <Outlet />
    </div>
  );
}
