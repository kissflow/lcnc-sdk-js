---
title: Update Field
description: Set new value to a column
sidebar:
    order: 15
---

Updates the value of given columnId in the object.

### Parameter

| Parameters | type   | description                                                                                                                               |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| payload    | Object | Object with keys as fieldId(string) and its values as respective field type(like number for rating/slider, string for text/textarea etc.) |

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
