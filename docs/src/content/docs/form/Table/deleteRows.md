---
title: Delete rows
description: Delete multiple rows form table
sidebar:
    order: 9
---

Deletes multiple rows from the specified [table instance](/form/gettable/).

### Parameter

| Parameters | Type             |
| ---------- | ---------------- |
| rows       | Array of Strings |

### Syntax

```js
let rows = ["rowId1", "rowId2"];
tableInstance.deleteRow(rows);
```
