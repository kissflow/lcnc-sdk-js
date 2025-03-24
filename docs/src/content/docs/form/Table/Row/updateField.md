---
title: Update field
description: Set new value to a column
sidebar:
  order: 15
---

Updates the value of the given columnId in the row.

### Parameter

| Parameters | Type   | Description                                                                                                                                                                        |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payload    | Object | An object where the keys represent the fieldId (string) and the values correspond to their respective field types (like number for rating/slider, string for text/textarea, etc.). |

### Syntax

```js
let payload = {
    "ratingColumn": 4,
    "sliderColumn": 9,
    "textColumn": "new value",
};
kf.context.updateField(payload).then((res) => {...})
```

or

```js
let value = await kf.context.updateField(payload);
```

### Returns

Returns the new value of the column, data type of value depends upon its field type.

### Example

To update the values of background check completion in your employee data form, mention the column ID and the desired values in the payload. The form will be updated with the new values.

```js
let payload = {
    "columnId6": “Pending”,
};
kf.context.updateField(payload).then((res) => {...})
```
