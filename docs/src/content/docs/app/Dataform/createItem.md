---
title: Create item
description: Create a new item in a dataform
sidebar:
  order: 34
---

Creates a new item in the dataform.

### Parameters

| Parameters | Type   | Description                                                          |
| ---------- | ------ | ----------------------------------------------------------------------|
| options    | Object | Optional. `data` (Object) - initial field values keyed by field Id; `viewId` (String). |

### Syntax

```js
const item = await dataformInstance.createItem({ data: { Name: "New Item" } });
```

### Returns

Returns the newly created item, including its `_id`.
