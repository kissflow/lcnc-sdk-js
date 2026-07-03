/**
 * Offline mock of the Kissflow SDK (`kf`), seeded from `lib/kf-schema.json`.
 *
 * Lets a Kissflow App UI **run and be tested outside the Kissflow iframe** — where
 * the real `KFSDK.initialize()` never resolves. Each synced data model becomes an
 * in-memory store with `getItems`/`getItem`/`createItem`/`updateItem`/`deleteItem`,
 * so pages render against realistic data. The active role is supplied by the
 * provider (see the dev role switcher) and reflected on `kf.user`.
 *
 * This is DEV-ONLY scaffolding — in real Kissflow the genuine SDK is used.
 */
import type { KfInstance } from "../context";
import type { KfSchema, KfSchemaModel } from "./schema";

interface MockRow {
  _id: string;
  [key: string]: unknown;
}

const PROCESS_SAMPLE: Record<string, unknown> = {
  _status: "In Progress",
  _current_step: "Review",
  _current_assigned_to: { Name: "Dev User", _id: "u_mock" },
  _submitted_at: "2026-06-23T10:00:00.000Z",
  _request_number: 1001,
  _progress: 40,
  _counter: 1,
};

/** A deterministic sample value for a field type (no randomness → stable demos). */
function sampleValue(field: { id: string; name: string; type: string }, i: number): unknown {
  const t = (field.type || "Text").toLowerCase();
  switch (t) {
    case "number":
      return (i + 1) * 10;
    case "currency":
      return Number(((i + 1) * 99.5).toFixed(2));
    case "date":
      return `2026-06-${String((i % 27) + 1).padStart(2, "0")}`;
    case "datetime":
      return `2026-06-${String((i % 27) + 1).padStart(2, "0")}T09:30:00.000Z`;
    case "email":
      return `user${i + 1}@example.com`;
    case "boolean":
    case "yes/no":
      return i % 2 === 0;
    case "select":
    case "dropdown":
      return ["Option A", "Option B", "Option C"][i % 3];
    default:
      return `${field.name} ${i + 1}`;
  }
}

function makeRows(model: KfSchemaModel, count = 5): MockRow[] {
  const isProcess = model.type === "Process";
  return Array.from({ length: count }, (_, i) => {
    const row: MockRow = { _id: `${model.id}_${i + 1}` };
    for (const f of model.fields) row[f.id] = sampleValue(f, i);
    if (isProcess) Object.assign(row, PROCESS_SAMPLE, { _request_number: 1001 + i });
    return row;
  });
}

function columns(model: KfSchemaModel) {
  return model.fields.map((f) => ({
    Id: f.id,
    Name: f.name,
    Type: f.type,
    IsInternal: false,
    Required: f.required,
  }));
}

let idSeq = 1000;
const nextId = (prefix: string) => `${prefix}_${++idSeq}`;

/**
 * Build a mock `kf`. The provider mutates `kf.user.AppRoles` when the dev switches
 * role, so the same instance is reused (stable identity for route-sync).
 */
export function createMockKf(schema: KfSchema): KfInstance {
  const stores = new Map<string, MockRow[]>();
  const modelById = new Map<string, KfSchemaModel>();
  for (const m of schema.dataModels) {
    stores.set(m.id, makeRows(m));
    modelById.set(m.id, m);
  }

  function flowHandle(flowId: string, idKey: "itemId" | "instanceId") {
    const rows = () => stores.get(flowId) ?? [];
    const model = modelById.get(flowId);
    const cols = () => (model ? columns(model) : []);
    const getId = (args: Record<string, unknown> = {}) => args[idKey] as string;

    return {
      getItems: async (opts: { pageNumber?: number; pageSize?: number } = {}) => {
        const all = rows();
        const size = opts.pageSize ?? all.length;
        const page = opts.pageNumber ?? 1;
        const start = (page - 1) * size;
        return { Data: all.slice(start, start + size), count: all.length, Columns: cols() };
      },
      getItem: async (args: Record<string, unknown>) =>
        rows().find((r) => r._id === getId(args)) ?? null,
      createItem: async (args: { data?: Record<string, unknown> } = {}) => {
        const row: MockRow = { _id: nextId(flowId), ...(args.data ?? {}) };
        if (model?.type === "Process") Object.assign(row, PROCESS_SAMPLE);
        rows().push(row);
        return row;
      },
      updateItem: async (args: Record<string, unknown>) => {
        const row = rows().find((r) => r._id === getId(args));
        if (row && args.data) Object.assign(row, args.data as object);
        return row ?? null;
      },
      deleteItem: async (args: Record<string, unknown>) => {
        const list = rows();
        const i = list.findIndex((r) => r._id === getId(args));
        if (i >= 0) list.splice(i, 1);
      },
      submitItem: async () => {},
      discardItem: async () => {},
      getFields: async () => cols(),
      openForm: async () => {},
    };
  }

  let route = "/";
  const variables: Record<string, unknown> = {};
  const setVar = async (k: string | Record<string, unknown>, v?: unknown) => {
    if (typeof k === "object") Object.assign(variables, k);
    else variables[k] = v;
  };

  const page = {
    _id: "page_mock",
    getRoute: () => route,
    setRoute: (p: string) => {
      route = p;
    },
    getParameter: async (k: string) => `mock_${k}`,
    getAllParameters: async () => ({}),
    getVariable: async (k: string) => variables[k],
    setVariable: setVar,
    openPopup: async (id: string) => console.info("[mock] openPopup", id),
    getComponent: async () => ({ refresh: async () => {}, onMount: (cb: () => void) => cb() }),
    popup: {
      _id: "popup_mock",
      getParameter: async (k: string) => `mock_${k}`,
      getAllParameters: async () => ({}),
      close: async () => {},
      getComponent: async () => ({ refresh: async () => {}, onMount: (cb: () => void) => cb() }),
    },
  };

  const kf = {
    user: { _id: "u_mock", Name: "Dev User", Email: "dev@example.com", AppRoles: [] as { _id: string; Name: string }[], Role: undefined as string | undefined },
    account: { _id: schema.app.accountId ?? "acc_mock" },
    env: { isMobile: false },
    context: {
      watchParams: () => {},
      // Offline navigation is driven by the in-iframe MemoryRouter; the host never
      // pushes routes, so watchRoute never fires.
      watchRoute: () => {},
    },
    app: {
      _id: schema.app.id,
      page,
      getVariable: async (k: string) => variables[k],
      setVariable: setVar,
      openPage: async (id: string) => {
        route = "/" + id;
      },
      getDataform: (id: string) => flowHandle(id, "itemId"),
      getProcess: (id: string) => flowHandle(id, "instanceId"),
      getBoard: (id: string) => flowHandle(id, "instanceId"),
      getDecisionTable: () => ({}),
    },
    client: {
      showInfo: async (m: unknown) => console.info("[mock] showInfo", m),
      showConfirm: async (o: unknown) => {
        console.info("[mock] showConfirm", o);
        return { action: "OK" as const };
      },
      redirect: async (url: string) => console.info("[mock] redirect", url),
      getImageUrl: async () => "data:image/png;base64,iVBORw0KGgo=",
    },
    formatter: {
      toDate: async (v: string) => v,
      toDateTime: async (v: string) => v,
      toNumber: async (v: string) => v,
      toCurrency: async (v: string, c: string) => `${c} ${v}`,
      toBoolean: async (v: string) => (["yes", "1", "true"].includes(String(v).toLowerCase()) ? "true" : "false"),
    },
    api: async (url: string, args?: object) => {
      console.info("[mock] kf.api", (args as { method?: string })?.method ?? "GET", url);
      if (url.includes("/account/")) return { _id: kf.account._id, Name: "Mock Account", _mock: true };
      return { _mock: true, url };
    },
  };

  return kf as unknown as KfInstance;
}
