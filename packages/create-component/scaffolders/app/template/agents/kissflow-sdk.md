# Kissflow SDK reference (for building app UI pages)

How to read and write Kissflow data from a page in this app. The SDK is the
`@sooryakanth/lowcode-client-sdk` instance returned by `useKf()` from `@sooryakanth/app-ui`.

> **Always get flow/model ids and field ids from [`../lib/kf-context.md`](../lib/kf-context.md)**
> (run `npm run kf:sync` to generate it). Don't invent ids.

```jsx
import { useKf } from "@sooryakanth/app-ui";

function Example() {
  const kf = useKf();           // ready-to-use SDK instance
  // ...every method below is async — await it.
}
```

## Who / where (context)

| Access | Returns |
| --- | --- |
| `kf.user` | `{ _id, Name, Email, Role, AppRoles }` — current user + their app roles |
| `kf.account` | `{ _id }` — current account |
| `kf.env` | `{ isMobile }` |
| `kf.context.watchParams(cb)` | subscribe to params the host passes in |

Use `kf.user.AppRoles` to gate UI by role (role ids/names are in `lib/kf-context.md`).

---

## Data models

Get a handle by id, then call methods on it. **Ids come from `lib/kf-context.md`.**

### Dataform — `kf.app.getDataform(id)`

A dataform is a simple data table. Items are keyed by `_id`.

```js
const form = kf.app.getDataform("Catalog_Types_A00");

const { items, total } = await form.getItems({
  searchValue: "",      // optional text search
  pageNumber: 1,        // default 1
  pageSize: 50,         // default 50
  viewId: "",           // optional view
  payload: {},          // optional filter payload
}); // returns { Columns, Data, count }

const item   = await form.getItem({ itemId: "id_123" });
const created = await form.createItem({ data: { Name: "New", Amount: 10 } });
const updated = await form.updateItem({ itemId: "id_123", data: { Amount: 20 } });
await form.deleteItem({ itemId: "id_123" });
await form.submitItem({ itemId: "id_123" });     // finalize a draft
await form.discardItem();                        // discard current draft
const fields = await form.getFields();           // field definitions
await form.openForm({ _id: "id_123" });          // open the native form UI
```

### Process — `kf.app.getProcess(id)`

A workflow. Items carry both an instance id (`_id`) and an activity instance id
(`_activity_instance_id`); **task actions need both.** System fields like `_status`,
`_current_step`, `_request_number` are listed per process in `lib/kf-context.md`.

```js
const proc = kf.app.getProcess("Purchase_Request_A00");

// queries (all return { items, total })
await proc.getMyItems({ status: "all" });          // "all" | "draft" | "inprogress"
await proc.getMyTasksItems({ activityId: "" });    // tasks assigned to me
await proc.getParticipatedItems();                 // items I acted on
await proc.getAdminItems();                        // all items (needs admin)
const item = await proc.getItem({ instanceId: "id_123" });

// lifecycle
const started = await proc.createItem({ data: { LeaveType: "Annual" } });
await proc.updateItem({ instanceId, activityInstanceId, data: { ... } });
await proc.submitItem({ instanceId, activityInstanceId, comment: "" });
await proc.rejectItem({ instanceId, activityInstanceId, comment: "Not approved" });
await proc.sendbackItem({ instanceId, activityInstanceId, stepId, comment });
await proc.withdrawItem({ instanceId, comment: "" });          // initiator
await proc.reassignItem({ instanceId, activityInstanceId, reassignTo: { _id }, comment });
await proc.restartItem({ instanceId, activityInstanceId });
await proc.discardItem({ instanceId });
await proc.deleteItem({ instanceId });

// metadata
await proc.getFields();
await proc.getProgress({ instanceId: "id_123" });  // timeline of an instance
await proc.openForm({ _id: "id_123", _activity_instance_id: "act_456" });
```

### Board — `kf.app.getBoard(id)`

A board/case model. Items are keyed by `instanceId` (`_id`).

```js
const board = kf.app.getBoard("Inventory");

const { items, total } = await board.getItems({ viewId: "AllItems_View" });
const item    = await board.getItem({ instanceId: "id_123" });
const created = await board.createItem({ data: { Name: "New Item" } });
await board.updateItem({ instanceId: "id_123", data: { Name: "Updated" } });
await board.deleteItem({ instanceId: "id_123" });
await board.submitItem({ instanceId: "id_123" });
await board.discardItem({ instanceId: "id_123" });
await board.getFields({ viewId: "" });
await board.openForm({ _id: "id_123" });
```

### Decision table — `kf.app.getDecisionTable(id)`

```js
const dt = kf.app.getDecisionTable("Pricing_Rules");
const result = await dt.evaluate({ region: "US", tier: "gold" });
```

---

## App & page state

```js
// App variables (shared across the app)
await kf.app.getVariable("CartTotal");
await kf.app.setVariable("CartTotal", 42);
await kf.app.setVariable({ CartTotal: 42, Currency: "USD" });   // batch

// Navigate to a built-in Kissflow page (not your custom routes)
await kf.app.openPage("PageId", { someParam: "x" });

// Page params & variables (params passed into this UI)
await kf.app.page.getParameter("id");
await kf.app.page.getAllParameters();
await kf.app.page.getVariable("key");
await kf.app.page.setVariable("key", "value");
await kf.app.page.openPopup("PopupId", { param: "x" });
```

> For navigation **within your own UI**, use `KfLink` / `useKfRouter()` from
> `@sooryakanth/app-ui` — not `openPage`. See [`../CLAUDE.md`](../CLAUDE.md).

---

## Client (UI feedback)

```js
await kf.client.showInfo("Saved successfully");

const { action } = await kf.client.showConfirm({
  title: "Delete record?",
  content: "This cannot be undone.",
  okText: "Delete",
  cancelText: "Cancel",
});
if (action === "OK") { /* ... */ }

kf.client.redirect("https://example.com");        // navigate the platform

// Kissflow-hosted images can't load directly in the iframe (CORS) — resolve to base64:
const src = await kf.client.getImageUrl(imageFieldValue);
// <img src={src} />
```

## Formatter (localized display)

Returns strings formatted to the account's locale/settings.

```js
await kf.formatter.toDate("2026-06-23");
await kf.formatter.toDateTime("2026-06-23T10:00:00Z");
await kf.formatter.toNumber("1234.5");
await kf.formatter.toCurrency("1234.5", "USD");
await kf.formatter.toBoolean("true");
```

## Raw REST — `kf.api(url, options?)`

Escape hatch for any Kissflow REST endpoint, authenticated as the current user.
The flow helpers above cover most needs — reach for this only when there's no helper.

```js
const data = await kf.api(`/dataform/2/${kf.account._id}/Catalog_Types_A00/list`);
await kf.api(`/process/2/${kf.account._id}/Purchase_Request_A00/...`, {
  method: "POST",
  body: { /* ... */ },
});
```

---

## Rules of thumb

- **Everything is async** — `await` every SDK call.
- **Ids are not guessable** — read model ids, field ids, and role ids from `lib/kf-context.md`.
- **Process actions need `instanceId` + `activityInstanceId`**; dataform/board actions need just the item id.
- **Read/write fields by their field id** (the `Id` column in `lib/kf-context.md`), not the display name.
- Wrap calls in `try/catch`; surface failures with `kf.client.showInfo`.
