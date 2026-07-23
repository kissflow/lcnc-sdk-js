---
title: Get participated fields
description: Retrieve field definitions for a step, scoped to the "participated" view
sidebar:
  order: 72
---

Retrieves field definitions for a specific step, scoped to the "participated" view.

### Parameters

| Parameters | Type   | Description                    |
| ---------- | ------ | -------------------------------- |
| activityId | String | Required. Id of the target step. |

### Syntax

```js
const fields = await processInstance.getParticipatedFields({ activityId: "Approval_Step" });
```
