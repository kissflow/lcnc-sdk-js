---
title: to JSON
description: Retrieve data of current form as json
sidebar:
  order: 4
---

To retrieve the data of the current form in JSON format.

### Syntax

```js
kf.context.toJSON().then((formValues) => {...})
```

or

```js
let formValues = await kf.context.toJSON();
```

### Returns

All the values in the data form in JSON format.

### Example

To view all the values in the employee data form, use this toJSON method and obtain the complete set of field values in JSON format.

Example output for the above scenario:

```js
 {
    "ratingField": 4,
    "sliderFieldId": 9,
    "Comments": "Exceeds expectations",
    "_flow_name": "form events",
    "_id": "Pk4_T1WGWuMe"
  }
```

