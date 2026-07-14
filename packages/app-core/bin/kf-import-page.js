#!/usr/bin/env node
/**
 * kf-import-page — distill a Kissflow page's builder layout into a clean "page spec"
 * (components, their data bindings, and section grouping) that an AI agent or human
 * can turn into a React page in src/pages/.
 *
 *   npx kf-import-page                 # all pages in the app
 *   npx kf-import-page <pageId> [...]  # specific pages
 *
 * Writes lib/pages/<pageId>.json (machine) + prints a per-page component inventory.
 * Needs the same .env as kf-sync (KF_* keys).
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { KissflowClient } from "./kissflow-client.js";

const cwd = process.cwd();

function loadEnv() {
  const p = join(cwd, ".env");
  if (typeof process.loadEnvFile === "function") {
    try { process.loadEnvFile(p); return; } catch { /* fall through */ }
  }
  if (!existsSync(p)) return;
  for (const raw of readFileSync(p, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}

// --- Schema graph → page spec --------------------------------------------------

/** Resolve the section (top-level container row) a component's container sits in. */
function sectionOf(schema, containerId, topLevel) {
  let cur = containerId;
  const seen = new Set();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    if (topLevel.has(cur)) return cur;
    const node = schema[cur];
    cur = node?.Container;
  }
  return containerId;
}

/** Config values mapped onto a component via its container's FieldMappings → Properties. */
function configFor(schema, containerId) {
  const config = {};
  for (const [, node] of Object.entries(schema)) {
    if (node?.Kind !== "FieldMapping" || node.Container !== containerId) continue;
    const propIds = node["FieldMapping::Property"] || [];
    const values = propIds.map((pid) => schema[pid]?.Value).filter((v) => v !== undefined);
    if (values.length) config[node.Name] = values.length === 1 ? values[0] : values;
  }
  return config;
}

function buildSpec(schema, pageId) {
  const page = schema[pageId] || {};
  const rootContainers = page["Page::Container"] || [];
  // Top-level sections = direct children of the body container.
  const body = rootContainers[0] ? schema[rootContainers[0]] : null;
  const topLevel = new Set(body?.["Container::Container"] || []);

  const componentIds = page["Page::Component"] || [];
  const components = componentIds.map((id) => {
    const n = schema[id] || {};
    const d = n.Data || {};
    return {
      id,
      name: n.Name,
      type: d.visualization_type || n.Name || "unknown",
      script: n.Script?.web,
      binding: {
        flowType: d.flow_type || null,
        flowId: d.flow_id || null,
        viewId: d.view_id || null,
        reportId: d.report_id || null,
        componentId: d.component_id || null,
      },
      config: configFor(schema, n.Container),
      section: sectionOf(schema, n.Container, topLevel),
    };
  });

  // Inventory
  const byType = {};
  const dataSources = {};
  for (const c of components) {
    byType[c.type] = (byType[c.type] || 0) + 1;
    if (c.binding.flowId) {
      const key = `${c.binding.flowId}${c.binding.viewId ? `/${c.binding.viewId}` : ""}`;
      dataSources[key] = (dataSources[key] || 0) + 1;
    }
  }

  // group by section, preserving component order
  const sectionsMap = new Map();
  for (const c of components) {
    if (!sectionsMap.has(c.section)) sectionsMap.set(c.section, []);
    sectionsMap.get(c.section).push(c);
  }
  const sections = [...sectionsMap.entries()].map(([container, comps]) => ({ container, components: comps }));

  return {
    page: { id: pageId, name: page.Name || pageId },
    summary: { total: components.length, byType, dataSources },
    sections,
  };
}

// --- Main ----------------------------------------------------------------------

async function main() {
  loadEnv();
  let client;
  try { client = new KissflowClient(); } catch (e) { console.error(`✗ ${e.message}`); process.exit(1); }

  let pageIds = process.argv.slice(2);
  if (pageIds.length === 0) {
    const pages = await client.getPages();
    pageIds = pages.map((p) => p.id);
    console.info(`Importing all ${pageIds.length} page(s) from ${client.appId}…`);
  }

  const outDir = join(cwd, "lib", "pages");
  mkdirSync(outDir, { recursive: true });

  for (const pageId of pageIds) {
    let schema;
    try {
      schema = await client.getPageSchema(pageId);
    } catch (e) {
      console.warn(`  ⚠ ${pageId}: ${e.message}`);
      continue;
    }
    const spec = buildSpec(schema, pageId);
    writeFileSync(join(outDir, `${pageId}.json`), JSON.stringify(spec, null, 2) + "\n");
    const types = Object.entries(spec.summary.byType).map(([t, n]) => `${n} ${t}`).join(", ");
    const src = Object.keys(spec.summary.dataSources).slice(0, 4).join(", ") || "—";
    console.info(`  ✓ ${spec.page.name} (${spec.page.id}): ${spec.summary.total} components [${types}]  data: ${src}`);
  }
  console.info(`\n→ specs in lib/pages/  (feed these to your agent to generate src/pages/*)`);
}

main().catch((e) => { console.error(`✗ ${e?.message ?? e}`); process.exit(1); });
