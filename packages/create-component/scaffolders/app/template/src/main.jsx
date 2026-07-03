import { createRoot } from "react-dom/client";
import { KfApp } from "@abdul-kissflow/app-ui";
import routes from "~react-pages";

import { AppShell } from "./components/app-shell.jsx";
import "./index.css";
// Loaded AFTER index.css so the accent presets win by source order.
import "./themes.css";

import { applyTheme, getTheme } from "./themes.js";

// Restore the chosen accent before first paint (default in themes.js).
applyTheme(getTheme());

// AppShell is the persistent root layout (like Next's app/layout.tsx).
createRoot(document.getElementById("root")).render(
    <KfApp routes={routes} layout={AppShell} />
);
