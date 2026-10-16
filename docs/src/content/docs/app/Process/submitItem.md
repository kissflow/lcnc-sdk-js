---
title: Submit item
description: Submit the current activity for a process instance
sidebar:
  order: 62
---

Submits the current activity/task for a process instance, advancing it to the next step.

### Parameters

| Parameters         | Type   | Description                    |
| ------------------- | ------ | -------------------------------- |
| instanceId          | String | Required.                        |
| activityInstanceId  | String | Required.                        |
| comment             | String | Optional.                        |

### Syntax

```js
await processInstance.submitItem({ instanceId: "item_123", activityInstanceId: "act_456" });
```
