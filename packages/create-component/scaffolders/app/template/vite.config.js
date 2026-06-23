import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import path from "node:path";
import { writeFileSync } from "node:fs";

export default defineConfig({
  plugins: [
    react(),
    // src/pages/**.jsx → routes. e.g. src/pages/items/[id].jsx → /items/:id
    Pages({ dirs: "src/pages" }),
    {
      name: "emit-kf-manifest",
      writeBundle() {
        writeFileSync(
          path.resolve(__dirname, "dist/manifest.json"),
          JSON.stringify({ Category: "Page", Framework: "React" }, null, 2),
        );
      },
    },
  ],
  // Relative asset paths so the built bundle works from a zip or any mount point.
  base: "",
  // Force a single copy of react / react-router so @kissflow/app-ui's MemoryRouter
  // and your pages' hooks share one RouterContext (otherwise the production build
  // can bundle two copies → "Cannot destructure property 'future' of … null").
  resolve: {
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
  build: { target: "es2022" },
  server: {
    port: 3000,
    host: "0.0.0.0",
    // HTTPS so the Kissflow (https) shell can iframe this without mixed-content blocks.
    https: {
      cert: path.resolve("./cert/localhost.crt"),
      key: path.resolve("./cert/localhost.key"),
    },
  },
});
