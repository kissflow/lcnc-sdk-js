---
title: Init form
description: Initialize a Form instance bound to a dataform record
sidebar:
  order: 41
---

Initializes and returns a [Form](/form/about/) instance bound to a dataform record, fetching its schema and data in one call. This is the recommended way to build a custom form UI for dataform records.

:::note[Custom components only]
`initForm` is available only in custom components (`kf.app` from the client SDK). It is not exposed in the Low-code / No-code (Run Script) SDKs.
:::

### Parameters

| Parameters | Type   | Description                                                          |
| ---------- | ------ | ----------------------------------------------------------------------|
| instanceId | String | Optional. If omitted, a new record is created.                        |
| viewId     | String | Optional. Scopes the form's schema/permissions to a specific view.    |

### Syntax

```js
// Load an existing record
const dataformInstance = kf.app.getDataform("EmpMaster");
const form = await dataformInstance.initForm("emp_123");
const data = await form.toJSON();

// Create a new record
const form = await dataformInstance.initForm();
await form.updateField({ firstName: "John" });
```

### Returns

Returns a [Form](/form/about/) instance.
