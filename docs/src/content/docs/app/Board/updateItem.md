---
title: Update item
description: Update an existing board item
sidebar:
  order: 15
---

Updates an existing board item.

### Parameters

| Parameters | Type   | Description                                                                        |
| ---------- | ------ | ------------------------------------------------------------------------------------ |
| options    | Object | `instanceId` (String, required), `data` (Object, required) - updated field values.   |

### Syntax

```js
await boardInstance.updateItem({ instanceId: "item_123", data: { Name: "Updated Item" } });
```

### Returns

Returns the updated item.
