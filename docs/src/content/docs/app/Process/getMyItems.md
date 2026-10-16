---
title: Get my items
description: Retrieve the process items initiated by the current user
sidebar:
  order: 51
---

Retrieves the process items initiated by the current user.

### Parameters

| Parameters | Type   | Description                                                                       |
| ---------- | ------ | ------------------------------------------------------------------------------------ |
| options    | Object | Optional. `status` (String, default `"all"`), `searchValue`, `pageNumber`, `pageSize`, `payload`. |

### Syntax

```js
const { items } = await processInstance.getMyItems({ status: "draft" });
```

### Returns

Returns an object containing an `items` array and the `total` item count.
