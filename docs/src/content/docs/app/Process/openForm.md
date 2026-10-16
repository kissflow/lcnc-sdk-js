---
title: Open form
description: Open the form UI for a process instance
sidebar:
  order: 61
---

Opens the form UI for a process instance.

### Parameters

| Parameters | Type   | Description                                                          |
| ---------- | ------ | ----------------------------------------------------------------------|
| item       | Object | The process item to open, `{ _id, _activity_instance_id }`.           |

### Syntax

```js
processInstance.openForm({ _id: "item_123", _activity_instance_id: "act_456" });
```
