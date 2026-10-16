---
title: Get reassignees
description: Retrieve users eligible to be reassigned a process task
sidebar:
  order: 67
---

Retrieves the list of users eligible to be reassigned a process task.

### Parameters

| Parameters         | Type   | Description                                        |
| ------------------- | ------ | ------------------------------------------------------|
| instanceId          | String | Required.                                              |
| activityInstanceId  | String | Required.                                              |
| pageNumber          | Number | Optional. Defaults to `1`.                             |
| pageSize            | Number | Optional. Defaults to `50`.                            |
| query               | String | Optional. Search term to filter candidates.            |

### Syntax

```js
const reassignees = await processInstance.getReassignees({ instanceId: "item_123", activityInstanceId: "act_456" });
```
