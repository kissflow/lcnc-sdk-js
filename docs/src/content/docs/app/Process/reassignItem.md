---
title: Reassign item
description: Reassign a process task to another user
sidebar:
  order: 66
---

Reassigns a process task to another user.

### Parameters

| Parameters       | Type   | Description                                                                 |
| ----------------- | ------ | ------------------------------------------------------------------------------ |
| instanceId        | String | Required.                                                                       |
| activityInstanceId| String | Required.                                                                       |
| reassignTo        | Object | Required. The target user.                                                      |
| comment           | String | Required.                                                                       |
| reassignType      | String | Optional. Defaults to `"approver"`.                                             |
| reassignedFrom    | Array  | Optional. Defaults to `[]`.                                                     |

### Syntax

```js
await processInstance.reassignItem({
    instanceId: "item_123",
    activityInstanceId: "act_456",
    reassignTo: { _id: "user_789" },
    comment: "Reassigning to manager"
});
```
