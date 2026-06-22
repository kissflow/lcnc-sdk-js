import { NavLink } from "react-router-dom";
import { useKf } from "@kissflow/app-ui";

// Sidebar nav. NavLink is a plain react-router link — RouteSync mirrors *any*
// navigation to the parent Kissflow URL, so you can use KfLink or NavLink freely.
const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true, icon: "▣" },
  { to: "/contacts", label: "Contacts", icon: "☷" },
  { to: "/settings", label: "Settings", icon: "⚙" },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export function AppShell({ title, children }) {
  const kf = useKf();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">◆</span> Acme CRM
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">Built with @kissflow/app-ui</div>
      </aside>

      <div className="main">
        <header className="topbar">
          <h1>{title}</h1>
          <div className="user">
            <span className="user-name">{kf.user?.Name ?? "Signed in"}</span>
            <span className="avatar sm">{initials(kf.user?.Name) || "•"}</span>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
