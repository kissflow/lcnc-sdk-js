---
title: Get field
description: Retrieve value of form field
sidebar:
    order: 1
---

To retrieve the current value of a form field.

### Parameter

| Parameters | Type   | Description             |
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

Returns the value of the field, and the data type varies based on the field type. 



### Example

To obtain the value of the rating field from your employee data form, use the field ID of the ratings field, ratingField, and retrieve the value. 

In this example, the data type of the returned value would be integer. 




```js
let value = await kf.context.getField(“ratingField”);
```

#### Output

```js
3
```

