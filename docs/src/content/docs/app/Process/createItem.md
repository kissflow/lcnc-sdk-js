---
title: Create item
description: Start a new process instance
sidebar:
  order: 56
---

Starts a new process instance.

### Parameters

| Parameters | Type   | Description                                                        |
| ---------- | ------ | ---------------------------------------------------------------------|
| options    | Object | Optional. `data` (Object) - initial field values keyed by field Id.  |

### Syntax

```js
const item = await processInstance.createItem({ data: { LeaveType: "Annual" } });
```

### Returns

Returns the newly created item, including its `_id` and `_activity_instance_id`.
