---
title: Update item
description: Update an existing dataform item
sidebar:
  order: 35
---

Updates an existing item.

### Parameters

| Parameters | Type   | Description                                                                                    |
| ---------- | ------ | -------------------------------------------------------------------------------------------------- |
| options    | Object | `itemId` (String, required), `data` (Object, required) - updated field values; `viewId` (String, optional). |

### Syntax

```js
await dataformInstance.updateItem({ itemId: "item_123", data: { Name: "Updated Item" } });
```

### Returns

Returns the updated item.
