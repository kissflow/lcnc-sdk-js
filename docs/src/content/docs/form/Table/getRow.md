---
title: Get Row
description: Retrieve a row instance from table
sidebar:
    order: 10
---

Returns a [row instance](/lcnc-sdk-js/form/table/row/) of `rowId` form given
[table instance](/lcnc-sdk-js/form/gettable/).

### Parameter

| Parameters | type   |
| ---------- | ------ |
| rowId      | String |

### Syntax

```js
let rowInstance = tableInstance.getRow(rowId);
```

### Example

From the rowInstance, methods like `updateField()`, `getField()` can be accessed.

```js
// A simple use case of updating a number column from the row.

let tableInstance = kf.context.getTable("someTableId");
let rowInstance = tableInstance.getRow("someRowId");
let counts = await rowInstance.getField("countNumber");
rowInstance.updateField({ countNumber: counts + 1 });
```

:::note[Note]
If there are more than one rows to be fetched from table then use
[getRows()](/lcnc-sdk-js/form/table/getrows/) instead 
:::
