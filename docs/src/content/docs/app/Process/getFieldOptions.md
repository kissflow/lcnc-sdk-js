---
title: Get field options
description: Retrieve options for a dropdown or lookup field
sidebar:
  order: 75
---

Retrieves the available options for a dropdown/lookup field.

### Parameters

| Parameters | Type   | Description                                                                                             |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------|
| options    | Object | Optional. `instanceId`, `activityInstanceId`, `fieldId`, plus optional `fieldType`, `tableId`, `tableRowId`. |

### Syntax

```js
const options = await processInstance.getFieldOptions({ instanceId: "item_123", activityInstanceId: "act_456", fieldId: "Category" });
```
