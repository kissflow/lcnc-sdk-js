---
title: Update Field
description: Set new value to a field
sidebar:
    order: 2
    badge:
        text: New
    variant: tip
---

Updates the value all fields given in the payload object

### Parameter

| Parameters | type   | description                                                                                                                               |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| payload    | Object | Object with keys as fieldId(string) and its values as respective field type(like number for rating/slider, string for text/textarea etc.) |

### Syntax

```js
let payload = {
    "ratingField": 4,
    "sliderFieldId": 9,
    "textField": "new value",
};
kf.context.updateField(payload).then((res) => {...})
```

or

```js
let value = await kf.context.updateField(payload);
```

### Returns

Returns the new value of the field, data type of value depends upon field.
