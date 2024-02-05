---
title: Get Table
description: Returns instance of table class
sidebar:
    order: 4
---

Returns the instance of `Table` class, from which addRow(), addRows(),
deleteRow(), deleteRows(), getRow(), getRows(), toJSON() can be accessed

### Parameter

| Parameters | type   | description             |
| ---------- | ------ | ----------------------- |
| tableId    | String | Unique Id of the table. |

### Syntax

```js
const tableInstance = kf.context.getTable(fieldId);
```
