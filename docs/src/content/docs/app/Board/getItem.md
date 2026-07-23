---
title: Get item
description: Retrieve a single board item by its instance ID
sidebar:
  order: 13
---

Retrieves a single board item by its instance ID.

### Parameters

| Parameters | Type   | Description                                       |
| ---------- | ------ | -------------------------------------------------- |
| instanceId | String | Unique Id of the board item. Required.              |

### Syntax

```js
const item = await boardInstance.getItem({ instanceId: "item_123" });
```

### Returns

Returns an object with the item's `_id` and `_view_id`.
