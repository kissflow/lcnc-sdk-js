---
title: Get row
description: Retrieve a row instance from table
sidebar:
    order: 10
---

Returns a [row instance](/form/table/row/) of `rowId` from the specified
[table instance](/form/gettable/).

From the row instance, you can access methods such as updateField(), getField(), and so on.


### Parameter

| Parameters | Type   |
| ---------- | ------ |
| rowId      | String |

### Syntax

```js
let rowInstance = tableInstance.getRow(rowId);
```

### Example

A simple use case for updating the years of experience in the employee dataform.

```js
let tableInstance = kf.context.getTable("work_table1");
let rowInstance = tableInstance.getRow("table_row_Id");
let yoe = await rowInstance.getField("table_field2");
rowInstance.updateField({ table_field2: yoe + 1 });
```

:::note[Note]
If there is more than one row to be fetched from a table, use
[getRows()](/form/table/getrows/) instead.
:::
