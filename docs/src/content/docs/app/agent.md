---
title: Custom Agent
description: Run an app's Custom Agents and read their results
---

A Custom Agent is an AI agent that belongs to an app. It takes the inputs you
declare (text, numbers, true/false values, one file) and returns structured
output items. Calls run as the signed-in user, against the Agent's published
definition.

Get an Agent instance using `getAgent` from the app's interface. Getting the
instance sends no request.

##### Parameters

| Parameter | Type   |
| --------- | ------ |
| agentId   | String |

##### Syntax

```js
const agent = kf.app.getAgent(agentId);
```

### Get contract

Reads the Agent's published inputs, outputs and readiness.

##### Syntax

```js
const contract = await agent.getContract();
```

##### Return

```js
{
  AgentId: "AgXXXXXXXXXX",
  Definition: {
    Name: "Request summariser",
    Inputs: [
      { Key: "request", Name: "Request", DataType: "Text", Required: true },
      { Key: "amount", Name: "Amount", DataType: "Number", Required: true }
    ],
    Outputs: [
      { Key: "summary", Name: "Summary", DataType: "string" },
      { Key: "needs_review", Name: "Needs review", DataType: "boolean" }
    ],
    MaxOutputItems: 1
  },
  Readiness: { Ready: true, Issues: [] }
}
```

### Execute

Starts a run. It resolves as soon as the run is accepted, not when it
finishes: use `onExecutionComplete` or `getExecution` for the result.

##### Parameters

| Parameter         | Type   | Description                                        |
| ----------------- | ------ | -------------------------------------------------- |
| options.inputData | Object | Values keyed by the input `Key`s in the contract.  |

An `Attachment` input takes one file: `{ Key, FileName, Size? }` for a Kissflow
attachment, or `{ Url, FileName }` for an `https` URL.

##### Syntax

```js
const { ExecutionId, Status } = await agent.execute({
  inputData: { request: "Two standing desks for the design team", amount: 54000 },
});
```

`execute` is never retried. If it fails with `AGENT_EXECUTE_OUTCOME_UNKNOWN`,
the run may still have started; `AGENT_EXECUTE_NOT_SENT` means it did not.

### Get execution

Reads a run's current state. `Output.items` is present once the run is
`Completed`, `Error` once it is `Failed`. People who are not the app's
developers can read only their own runs.

##### Syntax

```js
const execution = await agent.getExecution(executionId);
```

##### Return

```js
{
  ExecutionId: "…",
  Status: "Completed", // Queued | NotStarted | Running | Completed | Failed
  Output: { items: [{ summary: "Two standing desks for the design team.", needs_review: true }] },
  CreatedAt: "…", StartedAt: "…", CompletedAt: "…"
}
```

### On execution complete

Calls `onComplete` once when the run finishes, with the same object
`getExecution` returns. A `Failed` run is a result, so read `Status`.
`onWatchError` is called instead if observation stops: the host does not
support it, access was refused, or about five minutes passed
(`AGENT_OBSERVATION_STOPPED`; the run may still finish, so read it again
later). Returns a function that stops observing; it never cancels the run.

##### Syntax

```js
const stop = agent.onExecutionComplete(
  ExecutionId,
  (execution) => {
    if (execution.Status === "Completed") show(execution.Output.items);
    else showFailure(execution.Error);
  },
  (error) => warn(error.errorCode),
);

// later, for example when the page unmounts
stop();
```

### Errors

Methods reject (and `onWatchError` receives) `{ isError: true, error, errorCode }`.
`errorCode` is a platform code (`KISSFLOW_ERROR_…`) or an `AGENT_…` code, including:
`AGENT_HOST_TIMEOUT`, `AGENT_REQUEST_NOT_SENT`, `AGENT_EXECUTE_OUTCOME_UNKNOWN`,
`AGENT_EXECUTE_NOT_SENT`, `AGENT_HOST_UNSUPPORTED`, `AGENT_WATCH_INVALID_EVENT`,
`AGENT_OBSERVATION_STOPPED`, `AGENT_READ_TIMEOUT` (Kissflow did not answer a read in
time; try again) and `AGENT_OFFLINE` (a read while the user is offline). Show the
`error` text for a code you do not handle.

##### Example

The callbacks live as long as the page, component or script that registered
them; stop observing when it goes away.

```js
const agent = kf.app.getAgent("AgXXXXXXXXXX");
const { ExecutionId } = await agent.execute({
  inputData: { request: "Two standing desks for the design team", amount: 54000 },
});
const stop = agent.onExecutionComplete(
  ExecutionId,
  (execution) => {
    if (execution.Status === "Failed") return showFailure(execution.Error);
    const [result] = execution.Output.items;
    showSummary(result.summary, result.needs_review);
  },
  (error) => showNotice(`Still waiting? Check again later (${error.errorCode}).`),
);
```
