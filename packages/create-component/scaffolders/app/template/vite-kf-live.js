/**
 * Dev-server plugin: live Kissflow data outside the iframe.
 *
 * Adds a `/__kf/*` proxy that forwards to the real Kissflow REST API with the admin
 * access key attached **server-side** — so the browser app can read/write your dev
 * app without the keys ever reaching client code, and without CORS issues.
 *
 * Enabled only when a `.env` with KF_DOMAIN + KF_ACCESS_KEY_* is present. When enabled
 * it sets `import.meta.env.VITE_KF_LIVE` so the framework boots in live mode (real data)
 * instead of the offline mock. Dev-only — never part of the production bundle.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function loadDotEnv(root) {
  const out = {};
  const p = join(root, ".env");
  if (!existsSync(p)) return out;
  for (const raw of readFileSync(p, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

export function kfLiveProxy() {
  let env = {};
  let live = false;

  return {
    name: "kf-live-proxy",
    apply: "serve", // dev server only — never in `vite build`

    config(_, { root } = {}) {
      env = loadDotEnv(root || process.cwd());
      live = Boolean(env.KF_DOMAIN && env.KF_ACCESS_KEY_ID && env.KF_ACCESS_KEY_SECRET);
      return {
        define: { "import.meta.env.VITE_KF_LIVE": JSON.stringify(live ? "1" : "") },
      };
    },

    configResolved() {
      const where = live ? `live → ${env.KF_DOMAIN} (app ${env.KF_APP_ID})` : "off (no .env keys)";
      console.info(`\n  ⬡ kf-live-proxy: ${where}\n`);
    },

    configureServer(server) {
      if (!live) return;
      server.middlewares.use("/__kf", async (req, res) => {
        // connect strips the "/__kf" mount, so req.url is the remainder.
        if (req.url === "/__status") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ live: true, domain: env.KF_DOMAIN, appId: env.KF_APP_ID }));
          return;
        }
        const target = `https://${env.KF_DOMAIN}${req.url}`;
        try {
          let body;
          if (req.method !== "GET" && req.method !== "HEAD") {
            const chunks = [];
            for await (const c of req) chunks.push(c);
            body = Buffer.concat(chunks);
            if (body.length === 0) body = undefined;
          }
          const upstream = await fetch(target, {
            method: req.method,
            headers: {
              "Content-Type": "application/json",
              "X-Access-Key-Id": env.KF_ACCESS_KEY_ID,
              "X-Access-Key-Secret": env.KF_ACCESS_KEY_SECRET,
            },
            body,
          });
          const text = await upstream.text();
          res.statusCode = upstream.status;
          res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
          res.end(text);
        } catch (err) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "kf-live-proxy upstream error", message: String(err?.message ?? err) }));
        }
      });
    },
  };
}
