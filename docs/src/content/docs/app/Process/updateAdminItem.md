---
title: Update admin item
description: Update a process instance as admin
sidebar:
  order: 60
---

Updates a process instance as admin, bypassing the normal step/permission flow. Requires admin access.

### Parameters

| Parameters | Type   | Description        |
| ---------- | ------ | -------------------- |
| instanceId | String | Required.             |
| data       | Object | Required.             |

### Syntax

```js
await processInstance.updateAdminItem({ instanceId: "item_123", data: { LeaveType: "Sick" } });
```
