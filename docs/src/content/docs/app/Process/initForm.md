---
title: Init form
description: Initialize a Form instance bound to a process task
sidebar:
  order: 76
---

Initializes and returns a [Form](/form/about/) instance bound to a process task, fetching its schema and data in one call. This is the recommended way to build a custom form UI for process instances.

:::note[Custom components only]
`initForm` is available only in custom components (`kf.app` from the client SDK). It is not exposed in the Low-code / No-code (Run Script) SDKs.
:::

### Parameters

| Parameters          | Type   | Description                                                          |
| -------------------- | ------ | ----------------------------------------------------------------------|
| instanceId           | String | Optional. If omitted, a new process instance is created.              |
| activityInstanceId   | String | Optional. The activity (task) instance the form is being filled for.  |

### Syntax

```js
// Start a new process instance
const form = await processInstance.initForm();
await form.updateField({ LeaveType: "Annual" });

// Continue an in-progress task
const form = await processInstance.initForm("item_123", "act_456");
const data = await form.toJSON();
```

### Returns

Returns a [Form](/form/about/) instance.
