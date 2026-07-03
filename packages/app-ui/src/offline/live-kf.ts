/**
 * LIVE dev `kf` — same shape as the mock, but data ops hit the real Kissflow REST
 * API through the dev-server proxy (`/__kf/*`, which attaches the admin access key
 * server-side). Lets a Kissflow App UI read AND write your real dev app while running
 * outside the Kissflow iframe.
 *
 * Verified REST contract (dev-lcncdemo):
 *   Form  list   GET  /form/2/{acct}/{id}/list            → { Data, count, Columns }
 *   Form  create POST /form/2/{acct}/{id}                  → draft (_id: draft_…)
 *   Form  submit POST /form/2/{acct}/{id}/{draftId}/submit → real record
 *   Form  delete DELETE /form/2/{acct}/{id}/{itemId}
 *   Case  list   GET  /case/2/{acct}/{id}/list             → { Data }
 *   Process list/admin needs admin/view scope on the key.
 *
 * DEV-ONLY. Never bundled into the Kissflow deployment (the proxy is dev-server only).
 */
import type { KfInstance } from "../context";
import type { KfSchema } from "./schema";

type Family = "form" | "case" | "process";

async function call(base: string, path: string, method = "GET", body?: unknown): Promise<any> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    const msg = json?.message || json?.en_message || `${res.status}`;
    throw new Error(`Kissflow ${method} ${path.split("?")[0]} → ${res.status}: ${msg}`);
  }
  return json;
}

export function createLiveKf(schema: KfSchema, base = "/__kf"): KfInstance {
  const acct = schema.app.accountId ?? "";
  const appQ = `_application_id=${schema.app.id}`;

  function flow(family: Family, id: string) {
    // path relative to the proxy base; `call` prepends `base`.
    const url = (sub = "") => `/${family}/2/${acct}/${id}${sub}?${appQ}`;
    const idOf = (a: Record<string, unknown> = {}) => (a.itemId ?? a.instanceId) as string;
    // Processes list per the user's own scope (assignee/initiator), not admin — the
    // `/list` and `/admin/.../list` paths require flow-admin rights, but `/myitems`
    // returns what this user is allowed to see by process permissions.
    const listPath = family === "process" ? "/myitems" : "/list";

    return {
      getItems: async (opts: { view?: string } = {}) => {
        const seg = opts.view ? `/${opts.view}` : listPath;
        const j = await call(base, url(seg));
        const Data = j?.Data ?? [];
        return { Data, count: j?.count ?? Data.length, Columns: j?.Columns ?? [] };
      },
      getItem: async (a: Record<string, unknown>) => call(base, url(`/${idOf(a)}`)),
      createItem: async (a: { data?: Record<string, unknown> } = {}) => {
        // Forms use a draft → submit flow; processes/cases create directly.
        const draft = await call(base, url(""), "POST", a.data ?? {});
        if (family === "form" && draft?._id) {
          return call(base, url(`/${draft._id}/submit`), "POST", {});
        }
        return draft;
      },
      updateItem: async (a: Record<string, unknown>) =>
        call(base, url(`/${idOf(a)}`), "POST", (a as { data?: unknown }).data ?? {}),
      deleteItem: async (a: Record<string, unknown>) => {
        await call(base, url(`/${idOf(a)}`), "DELETE");
      },
      submitItem: async () => {},
      discardItem: async () => {},
      getFields: async () => {
        // the real field schema (not the list view's columns)
        const j = await call(base, url("/fields"));
        return Array.isArray(j) ? j : j?.Columns ?? [];
      },
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
    _id: "page_live",
    getRoute: () => route,
    setRoute: (p: string) => {
      route = p;
    },
    getParameter: async () => undefined,
    getAllParameters: async () => ({}),
    getVariable: async (k: string) => variables[k],
    setVariable: setVar,
    openPopup: async () => {},
    getComponent: async () => ({ refresh: async () => {}, onMount: (cb: () => void) => cb() }),
    popup: {
      _id: "popup_live",
      getParameter: async () => undefined,
      getAllParameters: async () => ({}),
      close: async () => {},
      getComponent: async () => ({ refresh: async () => {}, onMount: (cb: () => void) => cb() }),
    },
  };

  const kf = {
    user: { _id: "u_live", Name: "Live (dev key)", Email: "dev@example.com", AppRoles: [] as { _id: string; Name: string }[], Role: undefined as string | undefined },
    account: { _id: acct },
    env: { isMobile: false },
    context: { watchParams: () => {}, watchRoute: () => {} },
    app: {
      _id: schema.app.id,
      page,
      getVariable: async (k: string) => variables[k],
      setVariable: setVar,
      openPage: async (id: string) => {
        route = "/" + id;
      },
      getDataform: (id: string) => flow("form", id),
      getProcess: (id: string) => flow("process", id),
      getBoard: (id: string) => flow("case", id),
      getDecisionTable: () => ({}),
    },
    client: {
      showInfo: async (m: unknown) => console.info("[live] showInfo", m),
      showConfirm: async () => ({ action: "OK" as const }),
      redirect: async (url: string) => console.info("[live] redirect", url),
      getImageUrl: async () => "data:image/png;base64,iVBORw0KGgo=",
    },
    formatter: {
      toDate: async (v: string) => v,
      toDateTime: async (v: string) => v,
      toNumber: async (v: string) => v,
      toCurrency: async (v: string, c: string) => `${c} ${v}`,
      toBoolean: async (v: string) => (["yes", "1", "true"].includes(String(v).toLowerCase()) ? "true" : "false"),
    },
    // Pass-through to any Kissflow REST endpoint via the proxy.
    api: async (url: string, args?: { method?: string; body?: unknown }) =>
      call(base, `${url.startsWith("/") ? "" : "/"}${url}`, args?.method ?? "GET", args?.body),
  };

  return kf as unknown as KfInstance;
}
