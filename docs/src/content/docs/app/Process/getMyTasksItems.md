---
title: Get my tasks
description: Retrieve the pending tasks assigned to the current user
sidebar:
  order: 52
---

Retrieves the pending tasks assigned to the current user.

### Parameters

| Parameters | Type   | Description                                                                          |
| ---------- | ------ | ---------------------------------------------------------------------------------------- |
| options    | Object | Optional. `activityId` (String) - scope to a specific step; `searchValue`, `pageNumber`, `pageSize`, `payload`. |

### Syntax

```js
const { items } = await processInstance.getMyTasksItems({ activityId: "Approval_Step" });
```
