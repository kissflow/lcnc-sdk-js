---
title: Get Field
description: Retrieve value of form field
sidebar:
    order: 14
---

To retrieve the current value of column in a row

### Parameter

| Parameters | type   | description             |
| ---------- | ------ | ----------------------- |
| columnId   | String | Unique Id of the column |

### Syntax

```js
kf.context.getField(columnId).then((res) => {...})
```

or

```js
let value = await kf.context.getField(columnId);
```

### Returns

Returns the value of the field, data type of value depends upon field.

Eg:

If given columnId is Rating/Slider field then return value would be of type
Integer.
