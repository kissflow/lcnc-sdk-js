---
title: Update item
description: Update an in-progress process instance
sidebar:
  order: 57
---

Updates an in-progress process instance.

### Parameters

| Parameters         | Type   | Description                                          |
| ------------------- | ------ | ------------------------------------------------------ |
| instanceId          | String | Required.                                               |
| activityInstanceId  | String | Required.                                               |
| data                | Object | Required. Updated field values keyed by field Id.       |

### Syntax

```js
await processInstance.updateItem({
    instanceId: "item_123",
    activityInstanceId: "act_456",
    data: { LeaveType: "Sick" }
});
```
