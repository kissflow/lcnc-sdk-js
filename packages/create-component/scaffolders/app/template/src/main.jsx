import { createRoot } from "react-dom/client";
import { KfApp } from "@kissflow/app-ui";
import routes from "~react-pages";

import { AppShell } from "./components/app-shell.jsx";

import "./index.css";

// AppShell is the persistent root layout (like Next's app/layout.tsx).
createRoot(document.getElementById("root")).render(
  <KfApp routes={routes} layout={AppShell} />,
);
