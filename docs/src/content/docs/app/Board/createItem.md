---
title: Create item
description: Create a new item in a board
sidebar:
  order: 14
---

Creates a new item in the board.

### Parameters

| Parameters | Type   | Description                                                          |
| ---------- | ------ | ---------------------------------------------------------------------- |
| options    | Object | Optional. `data` (Object) - initial field values keyed by field Id.   |

### Syntax

```js
const item = await boardInstance.createItem({ data: { Name: "New Item" } });
```

### Returns

Returns the newly created item, including its `_id`.
