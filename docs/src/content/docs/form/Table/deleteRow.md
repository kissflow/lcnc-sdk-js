---
title: Delete Row
description: Deletes a single row form table
sidebar:
    order: 8
---

Deletes a single row from the given
[table instance](/lcnc-sdk-js/form/gettable/).

### Parameter

| Parameters | type   |
| ---------- | ------ |
| rowId      | String |

### Syntax

```js
tableInstance.deleteRow(rowId);
```


:::note[Note] 
If there are more than one rows to be deleted from table then use
[deleteRow()](/lcnc-sdk-js/form/table/deleterows/) instead for these bulk
operations
:::
