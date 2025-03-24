---
title: Get field
description: Retrieve value of form field
sidebar:
  order: 14
---

To retrieve the current value of a column in a row.

### Parameter

| Parameters | Type   | Description             |
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

Returns the value of the field, and the data type of the value varies based on the field type.

### Example

To retrieve the names of the companies an employee has worked for from the work experience table, specify the corresponding column ID, table_col1, and retrieve the values.

```js
let value = await kf.context.getField(“table_col1”);
```

In this example, the returned data type will be `text`.
