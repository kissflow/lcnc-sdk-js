---
title: Update Field
description: Set new value to a field
sidebar:
    order: 2
---

Updates the values of all the fields mentioned in the payload object. 

### Parameter

| Parameters | type   | description                                                                                                                               |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| payload    | Object | An object where the key represents fieldId (string) and the values correspond to their respective field type (like number for rating/slider, string for text/textarea, etc.) |

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

Returns the updated value of the field, with the datatype of the value determined by the specific field type. 

### Example

To update the value of the ratings field in your employee data form, mention the field ID, ratingField, and the desired value, 4, in the payload. The form will be updated with the new value. 

```js
let payload = {
    "ratingField": 4,
};
kf.context.updateField(payload).then((res) => {...})
```

You can also update any number of fields in one payload. 
```js
let payload = {
    "ratingField": 4,
    "sliderFieldId": 9,
    "Comments": "Exceeds expectations",
};
kf.context.updateField(payload).then((res) => {...})
```