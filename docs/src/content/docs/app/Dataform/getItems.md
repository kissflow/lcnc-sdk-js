---
title: Get items
description: Retrieve a paginated list of items from a dataform
sidebar:
  order: 32
---

Retrieves a paginated list of items from the dataform.

### Parameters

| Parameters | Type   | Description                                                                            |
| ---------- | ------ | ------------------------------------------------------------------------------------------ |
| options    | Object | Optional query options: `viewId`, `searchValue`, `pageNumber`, `pageSize`, `payload`.       |

### Syntax

```js
const { items, total } = await dataformInstance.getItems();
```

### Returns

Returns an object containing an `items` array and the `total` item count.
