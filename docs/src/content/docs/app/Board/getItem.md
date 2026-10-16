---
title: Get item
description: Retrieve a single board item by its instance ID
sidebar:
  order: 13
---

Retrieves a single board item by its instance ID.

### Parameters

| Parameters | Type   | Description                                     |
| ---------- | ------ | ----------------------------------------------- |
| instanceId | String | Unique Id of the board item. Required.          |
| viewId     | String | Optional. Scopes the lookup to a specific view. |

### Syntax

```js
const item = await boardInstance.getItem({ instanceId: "item_123" });
```

### Returns

Returns the item's data with its `_id` and, if scoped to a view, `_view_id`.
