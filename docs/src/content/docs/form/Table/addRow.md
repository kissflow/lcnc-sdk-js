---
title: Add Row
description: Appends row details to the table.
sidebar:
    order: 6
---

Adds a single row to the specified
[table instance](/lcnc-sdk-js/form/gettable/).

### Parameter

| Parameters | type   | description                                                                                                                                |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| payload    | object | n object where the keys represent the columnId (string) and the values correspond to their respective field types (like number for rating/slider, string for text/textarea etc.) |

### Syntax

```js
tableInstance.addRow({ columnId1: value, columnId2: value });
```

### Example

To add a new work experience entry into the employee work experience table, work_table1, specify the relevant column IDs, table_field1, table_field2, along with their corresponding values. (Kissflow, 2 years). 

```js
worktableInstance.addRow({ table_field1: “Microsoft”, table_field2: “2 years” });
```

:::note[Note]
For bulk operations involving the addition of more than one row to a table, use the
[addRows()](/lcnc-sdk-js/form/table/addrows/) method instead.
:::

