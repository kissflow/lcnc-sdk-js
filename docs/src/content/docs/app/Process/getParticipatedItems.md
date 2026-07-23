---
title: Get participated items
description: Retrieve items the current user has taken action on
sidebar:
  order: 53
---

Retrieves items the current user has already taken action on.

### Parameters

| Parameters | Type   | Description                                                                          |
| ---------- | ------ | ---------------------------------------------------------------------------------------- |
| options    | Object | Optional. `activityId`, `searchValue`, `pageNumber`, `pageSize`, `payload`.               |

### Syntax

```js
const { items } = await processInstance.getParticipatedItems();
```
