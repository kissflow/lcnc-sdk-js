---
title: Get item
description: Retrieve a single dataform item by its ID
sidebar:
  order: 33
---

Retrieves a single item by its ID.

### Parameters

| Parameters | Type   | Description                                    |
| ---------- | ------ | ------------------------------------------------ |
| itemId     | String | Unique Id of the item. Required.                  |
| viewId     | String | Optional. Scopes the lookup to a specific view.   |

### Syntax

```js
const item = await dataformInstance.getItem({ itemId: "item_123" });
```

### Returns

Returns an object with the item's `_id` and, if scoped to a view, `_view_id`.
