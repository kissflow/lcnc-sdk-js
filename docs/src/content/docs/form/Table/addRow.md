---
title: Add row
description: Appends row details to the table.
---

Appends a single row into to specified `tableId`.

### Parameter

| Parameters | type   | description                                                                                                                                |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| payload    | object | Object with keys as columnId(string) and its values as respective field type(like number for rating/slider, string for text/textarea etc.) |

### Syntax

```js
const table = kf.context.getTable(tableId);
table.addRow({ columnId1: value, columnId2: value });
```

> Note: If there are more than one rows to be added to table then use `addRows()` instead for these bulk operations