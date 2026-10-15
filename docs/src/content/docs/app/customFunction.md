---
title: Custom Functions
description: Run a Custom Function and read its result
sidebar:
  order: 5
---

A Custom Function is server-side JavaScript authored inside an application and
called from page, component and flow event code. Whether a function is
**Interactive** (answers within 30 s) or **Background** (queued, up to 10 min)
is declared on the function, not chosen by the caller: the same `runFunction`
call serves both, and the shape of what it returns tells you which one ran.

`kf.app` exists only inside an application, so these methods are not available
outside one.

### Run a function

##### Parameters

| Parameter  | Type   | Description                                          |
| ---------- | ------ | ---------------------------------------------------- |
| name       | String | The function's name, as shown in the app's builder.  |
| parameters | Object | Input for the function. Optional; defaults to `{}`.  |

##### Syntax

```js
const run = await kf.app.runFunction("functionName", { key: "value" });
```

##### Return

A run envelope:

| Field  | Type   | Description                                                            |
| ------ | ------ | ---------------------------------------------------------------------- |
| RunId  | String | The run's id.                                                          |
| Status | String | `Queued`, `Running`, `Success`, `Failed` or `TimedOut`.                |
| Result | Any    | What the function returned. Present once the run has a result.         |
| Error  | Object | `{ Code, Message }` when the run failed.                               |

An Interactive function resolves with its terminal envelope, so `Result` is
already there. A Background function resolves with `Status: "Queued"` and only
`RunId`; fetch the rest with `getFunctionRun`, or wait for it with
`onFunctionRunComplete`.

A refused run rejects with the platform's SDK error shape: the message text is
in `error` and the code (`KISSFLOW_ERROR_…`) in `errorCode`.

##### Example

```js
const run = await kf.app.runFunction("screen_purchase_request", { amount: 68000 });
if (run.Status === "Success") {
  kf.app.page.setVariable("decision", run.Result.decision);
}
```

### Fetch a run

Reads a run's current state, including its `Result` once there is one. This is
also the fallback when a completion is missed: a page that reloads mid-run has
no listener attached, and the run record is the durable copy.

##### Parameters

| Parameter | Type   |
| --------- | ------ |
| runId     | String |

##### Syntax

```js
const run = await kf.app.getFunctionRun(runId);
```

##### Return

The run envelope described above.

##### Example

```js
const run = await kf.app.getFunctionRun(runId);
if (run.Status === "Success") {
  use(run.Result);
} else if (run.Status === "Failed") {
  console.error(run.Error.Message);
}
```

### Wait for a Background run

Calls `callBack` once, when the run reaches a terminal state. "Complete" means
the run stopped, not that it worked: it fires on `Failed` and `TimedOut` just
as it does on `Success`, so read `Status` before trusting `Result`. If the host
cannot watch the run at all, `onError` is called instead and `callBack` never
fires.

##### Parameters

| Parameter | Type     | Description                                                                 |
| --------- | -------- | --------------------------------------------------------------------------- |
| runId     | String   | The run to watch.                                                           |
| callBack  | Function | Receives the run envelope.                                                  |
| onError   | Function | Optional. Receives `{ isError, error, errorCode }` when the watch fails.    |

##### Syntax

```js
const stop = kf.app.onFunctionRunComplete(runId, callBack, onError);
```

##### Return

A function that unsubscribes. Calling it also tells the host to stop watching
the run.

The callback lives only as long as the script that registered it. Form events
end their script after 60 s, and a page event ends the previous one when it
fires again, while a Background run may take up to 600 s. For a run that may
outlive the script, poll `getFunctionRun` from a script that will still be
running, or re-attach after the script restarts.

##### Example

```js
const run = await kf.app.runFunction("generate_month_end_report", { month: "2026-09" });

const stop = kf.app.onFunctionRunComplete(
  run.RunId,
  (done) => {
    if (done.Status === "Success") {
      kf.app.page.setVariable("reportUrl", done.Result.url);
    } else {
      kf.client.showInfo(`Report ${done.Status.toLowerCase()}`);
    }
  },
  (err) => console.error(err.error)
);

// later, e.g. when the user leaves the page
stop();
```
