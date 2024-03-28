---
title: Delete Row
description: Deletes a single row form table
sidebar:
    order: 8
---

Deletes a single row from the specified
[table instance](/lcnc-sdk-js/form/gettable/).

### Parameter

| Parameters | type   |
| ---------- | ------ |
| rowId      | String |

### Syntax

```js
tableInstance.deleteRow(rowId);
```

### Example

To remove an entry from the employee work experience table, work_table1, specify the row ID, table_row_Id, in the payload and the entry will be deleted from your table. 

```js
worktableInstance.deleteRow(“table_row_Id”);
```



:::note[Note] 
For bulk operations involving the deletion of more than a row, use the
[deleteRow()](/lcnc-sdk-js/form/table/deleterows/) instead.
:::
