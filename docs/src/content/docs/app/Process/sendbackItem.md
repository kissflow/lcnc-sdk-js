---
title: Send back item
description: Send a process task back to a previous step
sidebar:
  order: 65
---

Sends a process task back to a previous step.

### Parameters

| Parameters         | Type   | Description                          |
| ------------------- | ------ | --------------------------------------|
| instanceId          | String | Required.                              |
| activityInstanceId  | String | Required.                              |
| stepId              | String | Required. Id of the target step.       |
| comment             | String | Required.                              |

### Syntax

```js
await processInstance.sendbackItem({
    instanceId: "item_123",
    activityInstanceId: "act_456",
    stepId: "step_789",
    comment: "Please revise"
});
```
