import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { SDKWrapper } from "./sdk/index.js";

import "./index.css";

const Root = createRoot(document.getElementById("root"));
Root.render(
	<SDKWrapper>
		<App />
	</SDKWrapper>
);
