import { createRoot } from "react-dom/client";
import { KfApp } from "@kissflow/app-ui";
import routes from "~react-pages";

import "./index.css";

createRoot(document.getElementById("root")).render(<KfApp routes={routes} />);
