---
title: Reject item
description: Reject a process task
sidebar:
  order: 63
---

Rejects a process task.

### Parameters

| Parameters         | Type   | Description                    |
| ------------------- | ------ | -------------------------------- |
| instanceId          | String | Required.                        |
| activityInstanceId  | String | Required.                        |
| comment             | String | Required.                        |

### Syntax

```js
await processInstance.rejectItem({ instanceId: "item_123", activityInstanceId: "act_456", comment: "Not approved" });
```
