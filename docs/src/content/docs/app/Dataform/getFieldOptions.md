---
title: Get field options
description: Retrieve options for a dropdown or lookup field
sidebar:
  order: 40
---

Retrieves the available options for a dropdown/lookup field.

### Parameters

| Parameters | Type   | Description                                                                                  |
| ---------- | ------ | ------------------------------------------------------------------------------------------------ |
| options    | Object | Optional. `instanceId`, `fieldId`, plus optional `fieldType`, `tableId`, `tableRowId`.            |

### Syntax

```js
const options = await dataformInstance.getFieldOptions({ instanceId: "item_123", fieldId: "Category" });
```

> Note
>
> Unlike [`Board`'s Get field options](/app/board/getfieldoptions/), all fields here are optional.
