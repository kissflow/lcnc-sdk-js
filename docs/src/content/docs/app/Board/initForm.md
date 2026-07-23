---
title: Init form
description: Initialize a Form instance bound to a board item
sidebar:
  order: 21
---

Initializes and returns a [Form](/form/about/) instance bound to a board item, fetching its schema and data in one call. This is the recommended way to build a custom form UI for board items.

:::note[Custom components only]
`initForm` is available only in custom components (`kf.app` from the client SDK). It is not exposed in the Low-code / No-code (Run Script) SDKs.
:::

### Parameters

| Parameters | Type   | Description                                                          |
| ---------- | ------ | ----------------------------------------------------------------------|
| instanceId | String | Optional. If omitted, a new board item is created.                    |
| viewId     | String | Optional. Scopes the form's schema/permissions to a specific view.    |

### Syntax

```js
// Create a new board item
const form = await boardInstance.initForm();
await form.updateField({ Name: "New Item" });

// Edit an existing board item
const form = await boardInstance.initForm("item_123");
const data = await form.toJSON();
```

### Returns

Returns a [Form](/form/about/) instance.
