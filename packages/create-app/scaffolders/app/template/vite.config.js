import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import path from "node:path";
import { writeFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";

// TEMPORARILY DISABLED: live-data proxy. Runtime data goes through the Kissflow
// SDK only; .env keys are for kf-sync/kf-import (metadata) — not runtime fetching.
// To re-enable, uncomment this import and the kfLiveProxy() plugin below.
// import { kfLiveProxy } from "./vite-kf-live.js";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // src/pages/**.jsx → routes. e.g. src/pages/items/[id].jsx → /items/:id
    Pages({ dirs: "src/pages" }),
    // /__kf/* → real Kissflow REST (admin key attached server-side). Dev only.
    // kfLiveProxy(),
    {
      name: "emit-kf-manifest",
      writeBundle() {
        writeFileSync(
          path.resolve(__dirname, "dist/manifest.json"),
          JSON.stringify(
            { Category: "Application", Framework: "React" },
            null,
            2
          )
        );
      }
    }
  ],
  // Relative asset paths so the built bundle works from a zip or any mount point.
  base: "",
  // Force a single copy of react / react-router so @abdul-kissflow/app-core's MemoryRouter
  // and your pages' hooks share one RouterContext (otherwise the production build
  // bundles two copies → "Cannot destructure property 'future' of … null").
  resolve: {
    dedupe: ["react", "react-dom", "react-router-dom"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  build: { target: "es2022" },
  server: {
    port: 3000,
    host: "0.0.0.0",
    // HTTPS so the Kissflow (https) shell can iframe this without mixed-content blocks.
    https: {
      cert: path.resolve("./cert/localhost.crt"),
      key: path.resolve("./cert/localhost.key")
    }
  }
});
