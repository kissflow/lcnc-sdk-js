---
title: Get fields
description: Retrieve a dataform's field definitions
sidebar:
  order: 39
---

Retrieves the dataform's field definitions.

### Parameters

| Parameters | Type   | Description                                                        |
| ---------- | ------ | ---------------------------------------------------------------------|
| options    | Object | Optional. `viewId` (String) - scope fields to a specific view.      |

### Syntax

```js
const fields = await dataformInstance.getFields();
```
