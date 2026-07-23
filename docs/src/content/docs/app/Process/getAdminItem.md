---
title: Get admin item
description: Retrieve a single process instance as admin
sidebar:
  order: 59
---

Retrieves a single process instance as admin. Requires admin access.

### Parameters

| Parameters | Type   | Description        |
| ---------- | ------ | -------------------- |
| instanceId | String | Required.             |

### Syntax

```js
const item = await processInstance.getAdminItem({ instanceId: "item_123" });
```
