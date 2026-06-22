import { useState } from "react";
import { useKf } from "@kissflow/app-ui";

import { AppShell } from "../components/app-shell.jsx";

// src/pages/settings.jsx → route "/settings"
export default function Settings() {
  const kf = useKf();
  const [api, setApi] = useState({ status: "idle" });

  async function runSample() {
    setApi({ status: "loading" });
    try {
      // Any Kissflow REST endpoint works here; this reads the current account.
      const data = await kf.api(`/account/2/${kf.account?._id}`);
      setApi({ status: "done", data });
    } catch (err) {
      setApi({ status: "error", message: String(err?.message ?? err) });
    }
  }

  return (
    <AppShell title="Settings">
      <h2>Kissflow context</h2>
      <p className="hint">Everything below comes from the live SDK (`useKf()`).</p>
      <dl className="details">
        <div>
          <dt>User</dt>
          <dd>{kf.user?.Name ?? "—"}</dd>
        </div>
        <div>
          <dt>User ID</dt>
          <dd>
            <code>{kf.user?._id ?? "—"}</code>
          </dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{kf.user?.Email ?? "—"}</dd>
        </div>
        <div>
          <dt>Account ID</dt>
          <dd>
            <code>{kf.account?._id ?? "—"}</code>
          </dd>
        </div>
      </dl>

      <h2>Sample API call</h2>
      <p className="hint">
        Calls <code>kf.api()</code> over the Kissflow bridge — the same
        authenticated client your real screens would use.
      </p>
      <button
        className="btn"
        onClick={runSample}
        disabled={api.status === "loading"}
      >
        {api.status === "loading" ? "Calling…" : "Run kf.api()"}
      </button>

      {api.status === "done" && (
        <pre className="code">{JSON.stringify(api.data, null, 2)}</pre>
      )}
      {api.status === "error" && (
        <pre className="code error">{api.message}</pre>
      )}
    </AppShell>
  );
}
