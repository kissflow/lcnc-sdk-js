---
title: Get items
description: Retrieve a paginated list of items from a board view
sidebar:
  order: 12
---

Retrieves a paginated list of items from a board view.

### Parameters

| Parameters | Type   | Description                                                                                |
| ---------- | ------ | ------------------------------------------------------------------------------------------- |
| options    | Object | Optional query options: `viewId`, `searchValue`, `pageNumber`, `pageSize`, `payload`.        |

### Syntax

```js
const { items, total } = await boardInstance.getItems({ viewId: "AllItems_View" });
```

### Returns

Returns an object containing an `items` array and the `total` item count.

### Example

```js
const boardInstance = kf.app.getBoard("Inventory");
const { items } = await boardInstance.getItems({ viewId: "AllItems_View" });
```
