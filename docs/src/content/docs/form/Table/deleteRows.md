---
title: Delete Rows
description: Delete multiple rows form table
sidebar:
    order: 9
---

Deletes multiple rows from the specified
[table instance](/lcnc-sdk-js/form/gettable/).

### Parameter

| Parameters | type             |
| ---------- | ---------------- |
| rows       | Array of Strings |

### Syntax

```js
let rows = ["rowId1", "rowId2"];
tableInstance.deleteRow(rows);
```
