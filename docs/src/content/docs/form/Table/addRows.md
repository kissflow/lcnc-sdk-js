---
title: Add Rows
description: Appends multiple rows details to the table.
sidebar:
    order: 7
    badge:
        text: New
---

Appends multiple rows to the [table instance](/lcnc-sdk-js/form/gettable/).

### Parameter

| Parameters | type  | description                                                                                                                                          |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| payload    | array | Array of objects with keys as columnId(string) and its values as respective field type(like number for rating/slider, string for text/textarea etc.) |

### Syntax

```js
tableInstance.addRows([
	{ columnId1: value, columnId2: value }, // row 1
	{ columnId1: value, columnId2: value } // row 2
]);
```

##### Example
```js
const table = kf.context.getTable(tableId);
let accumulator = [];
someArrayOfObjects.forEach(function(rowDetail) {
    accumulator.push({
        columnId1: rowDetail[columnId1], 
        columnId2: rowDetail[columnId2]
    });
});
await table.addRows(accumulator);
```
