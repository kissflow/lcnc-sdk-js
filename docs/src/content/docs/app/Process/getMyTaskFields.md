---
title: Get my task fields
description: Retrieve field definitions for a step, scoped to the "my tasks" view
sidebar:
  order: 71
---

Retrieves field definitions for a specific step, scoped to the "my tasks" view.

### Parameters

| Parameters | Type   | Description                    |
| ---------- | ------ | -------------------------------- |
| activityId | String | Required. Id of the target step. |

### Syntax

```js
const fields = await processInstance.getMyTaskFields({ activityId: "Approval_Step" });
```
