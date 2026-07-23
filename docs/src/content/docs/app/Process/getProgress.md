---
title: Get progress
description: Retrieve the step-by-step timeline of a process instance
sidebar:
  order: 74
---

Retrieves the step-by-step progress/timeline of a process instance.

### Parameters

| Parameters | Type   | Description        |
| ---------- | ------ | -------------------- |
| instanceId | String | Required.             |

### Syntax

```js
const progress = await processInstance.getProgress({ instanceId: "item_123" });
```
