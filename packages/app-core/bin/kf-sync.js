#!/usr/bin/env node
/**
 * kf-sync — pull this Kissflow app's data models and roles into the project as
 * context for humans and AI coding agents.
 *
 * Run from a project root (needs a .env with KF_* keys — see .env.example):
 *   npx kf-sync         # or: npm run kf:sync
 *
 * Writes:
 *   lib/kf-schema.json   machine-readable
 *   lib/kf-context.md    AI/human-readable
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { KissflowClient } from "./kissflow-client.js";

const cwd = process.cwd();

// --- Load .env (no dependency) -------------------------------------------------
function loadEnv() {
  const envPath = join(cwd, ".env");
  // Node >= 20.12 has a built-in loader.
  if (typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envPath);
      return;
    } catch {
      // no .env file (or unreadable) — fall through to manual / inherited env
    }
  }
  if (!existsSync(envPath)) return;
  for (const rawLine of readFileSync(envPath, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

// --- Markdown rendering --------------------------------------------------------
function fieldsTable(fields) {
  if (fields.length === 0) return "_No editable fields._\n";
  const head = "| Field | Id | Type | Required |\n| --- | --- | --- | --- |\n";
  const rows = fields
    .map((f) => `| ${f.name} | \`${f.id}\` | ${f.type} | ${f.required ? "yes" : "no"} |`)
    .join("\n");
  return head + rows + "\n";
}

function renderMarkdown({ app, generatedAt, dataModels, roles, pages = [] }) {
  const lines = [];
  lines.push("# Kissflow app context (auto-generated)");
  lines.push("");
  lines.push(
    `App \`${app.id}\` · generated ${generatedAt} · run \`npm run kf:sync\` to refresh.`,
  );
  lines.push("");
  lines.push(
    "> Source of truth for the **data models**, **roles**, **pages**, and **per-role " +
      "access** in this app. Build pages against these. Do not edit by hand — re-run " +
      "`kf-sync` instead.",
  );
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  if (pages.length === 0) {
    lines.push("_No pages found._");
  } else {
    lines.push("| Page | Id | Input parameters |");
    lines.push("| --- | --- | --- |");
    for (const p of pages) {
      const params = (p.inputParameters || []).map((x) => `\`${x.id}\`${x.required ? "*" : ""}`).join(", ") || "—";
      lines.push(`| ${p.name} | \`${p.id}\` | ${params} |`);
    }
  }
  lines.push("");

  lines.push("## Data models");
  lines.push("");
  if (dataModels.length === 0) {
    lines.push("_No live data models found._");
    lines.push("");
  }
  for (const m of dataModels) {
    lines.push(`### ${m.name} — \`${m.id}\` (${m.type})`);
    if (m.description) lines.push(`\n${m.description}`);
    lines.push("");
    lines.push(fieldsTable(m.fields));
    if (m.roleAccess && m.roleAccess.length > 0) {
      lines.push(
        "Roles with access: " +
          m.roleAccess
            .map((r) => `${r.name}${r.permission.length ? ` (${r.permission.join("/")})` : ""}`)
            .join(", ") +
          ".",
      );
      lines.push("");
    }
    if (m.systemFields && m.systemFields.length > 0) {
      lines.push(
        `System fields (always present on a ${m.type.toLowerCase()} item): ` +
          m.systemFields.map((s) => `\`${s}\``).join(", ") +
          ".",
      );
      lines.push("");
    }
  }

  lines.push("## Roles");
  lines.push("");
  if (roles.length === 0) {
    lines.push("_No roles found._");
  } else {
    lines.push("| Role | Id | Description | Users |");
    lines.push("| --- | --- | --- | --- |");
    for (const r of roles) {
      lines.push(
        `| ${r.name} | \`${r.id}\` | ${(r.description || "").replace(/\n/g, " ")} | ${r.userCount ?? ""} |`,
      );
    }
  }
  lines.push("");
  return lines.join("\n");
}

// --- Main ----------------------------------------------------------------------
async function main() {
  loadEnv();

  let client;
  try {
    client = new KissflowClient();
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(1);
  }

  console.info(`Syncing schema for app ${client.appId} from ${client.domain}…`);

  const [flows, rawRoles, pages] = await Promise.all([
    client.getFlowsWithFields(),
    client.getAppRoles(),
    client.getPages().catch(() => []),
  ]);

  const roles = (Array.isArray(rawRoles) ? rawRoles : []).map((r) => ({
    id: r._id,
    name: r.Name,
    description: r.Description || "",
    userCount: r.UserCount,
  }));

  const schema = {
    app: {
      id: client.appId,
      domain: client.domain,
      accountId: client.accountId,
    },
    generatedAt: new Date().toISOString(),
    dataModels: flows,
    roles,
    pages,
  };

  const libDir = join(cwd, "lib");
  mkdirSync(libDir, { recursive: true });
  writeFileSync(
    join(libDir, "kf-schema.json"),
    JSON.stringify(schema, null, 2) + "\n",
  );
  writeFileSync(join(libDir, "kf-context.md"), renderMarkdown(schema));

  console.info(
    `✓ ${flows.length} data model(s), ${roles.length} role(s), ${pages.length} page(s) → lib/kf-context.md, lib/kf-schema.json`,
  );
}

main().catch((err) => {
  console.error(`✗ ${err?.message ?? err}`);
  process.exit(1);
});
