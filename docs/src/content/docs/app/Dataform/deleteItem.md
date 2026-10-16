---
title: Delete item
description: Delete an item from a dataform
sidebar:
  order: 36
---

Deletes an item from the dataform.

### Parameters

| Parameters | Type   | Description                                          |
| ---------- | ------ | ------------------------------------------------------ |
| options    | Object | `itemId` (String, required); `viewId` (String, optional). |

### Syntax

```js
await dataformInstance.deleteItem({ itemId: "item_123" });
```
