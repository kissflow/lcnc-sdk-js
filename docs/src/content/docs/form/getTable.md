---
title: Get table
description: Returns instance of table class
sidebar:
  order: 3
---

Returns an instance of the Table class, providing access to methods such as addRow(), addRows(), deleteRow(), deleteRows(), getRow(), getRows(), and toJSON().

### Parameter

| Parameters | Type   | Description             |
| ---------- | ------ | ----------------------- |
| tableId    | String | Unique Id of the table. |

### Syntax

```js
const tableInstance = kf.context.getTable(fieldId);
```

### Example

To retrieve the instance of the employee work experience table from your data form, mention the table ID, work_table1.

```js
const worktableInstance = kf.context.getTable(“work_table1”);
```

Once you have obtained the table’s instance, you can execute various table operations like add row, get row, delete row, and so on.
