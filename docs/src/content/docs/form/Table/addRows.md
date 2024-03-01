---
title: Add Rows
description: Appends multiple rows details to the table.
sidebar:
    order: 7
    badge:
        text: New
---

Adds multiple rows to the [table instance](/lcnc-sdk-js/form/gettable/).

### Parameter

| Parameters | type  | description                                                                                                                                          |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| payload    | array | Array of objects where keys represent the columnId(string) and its values correspond to the respective field types (like number for rating/slider, string for text/textarea etc.). |

### Syntax

```js
tableInstance.addRows([
	{ columnId1: value, columnId2: value }, // row 1
	{ columnId1: value, columnId2: value } // row 2
]);
```

##### Example

Assume `employeeData` variable is fetched via an api call.

```js
const worktableInstance = kf.context.getTable(tableId);
let accumulator = [];
employeeData.forEach(function(data) {
    accumulator.push({
        table_field1: data[“Company”],
        table_field2: data[“YOE”]
    });
});
await worktableInstance.addRows(accumulator);

```
