---
title: Get fields
description: Retrieve a board's field definitions
sidebar:
  order: 19
---

Retrieves the board's field definitions.

### Parameters

| Parameters | Type   | Description                                                          |
| ---------- | ------ | ----------------------------------------------------------------------|
| options    | Object | Optional. `viewId` (String) - scope fields to a specific view.       |

### Syntax

```js
const fields = await boardInstance.getFields({ viewId: "AllItems_View" });
```
