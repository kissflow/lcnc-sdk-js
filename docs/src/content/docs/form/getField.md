---
title: Get Field
description: Retrieve value of form field
sidebar:
    order: 1
---

To retrieve the current value of a form field

### Parameter

| Parameters | type   | description             |
| ---------- | ------ | ----------------------- |
| fieldId    | String | Unique Id of the field. |

### Syntax

```js
kf.context.getField(fieldId).then((res) => {...})
```

or

```js
let value = await kf.context.getField(fieldId);
```

### Returns

Returns the value of the field, data type of value depends upon field.

Eg:

If given fieldId is Rating/Slider field then return value would be of type
Integer.
