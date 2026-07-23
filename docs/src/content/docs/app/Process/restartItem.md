---
title: Restart item
description: Restart a rejected or withdrawn process instance
sidebar:
  order: 68
---

Restarts a rejected or withdrawn process instance.

### Parameters

| Parameters         | Type   | Description        |
| ------------------- | ------ | -------------------- |
| instanceId          | String | Required.             |
| activityInstanceId  | String | Required.             |

### Syntax

```js
await processInstance.restartItem({ instanceId: "item_123", activityInstanceId: "act_456" });
```
