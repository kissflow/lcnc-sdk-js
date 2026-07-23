---
title: Get field options
description: Retrieve options for a dropdown or lookup field
sidebar:
  order: 20
---

Retrieves the available options for a dropdown/lookup field.

### Parameters

| Parameters | Type   | Description                                                                                                  |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| options    | Object | `instanceId` (String, required), `fieldId` (String, required), plus optional `fieldType`, `tableId`, `tableRowId`. |

### Syntax

```js
const options = await boardInstance.getFieldOptions({ instanceId: "item_123", fieldId: "Category" });
```

> Note
>
> Both `instanceId` and `fieldId` are required.
