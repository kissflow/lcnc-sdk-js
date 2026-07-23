---
title: Get item
description: Retrieve a single process instance
sidebar:
  order: 55
---

Retrieves a single process instance.

### Parameters

| Parameters         | Type   | Description                              |
| ------------------- | ------ | ------------------------------------------ |
| instanceId          | String | Unique Id of the process instance. Required. |
| activityInstanceId  | String | Id of the current activity instance. Required. |

### Syntax

```js
const item = await processInstance.getItem({ instanceId: "item_123", activityInstanceId: "act_456" });
```
