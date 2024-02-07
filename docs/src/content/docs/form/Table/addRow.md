---
title: Add Row
description: Appends row details to the table.
sidebar:
    order: 6
---

Appends a single row into to given
[table instance](/lcnc-sdk-js/form/gettable/).

### Parameter

| Parameters | type   | description                                                                                                                                |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| payload    | object | Object with keys as columnId(string) and its values as respective field type(like number for rating/slider, string for text/textarea etc.) |

### Syntax

```js
tableInstance.addRow({ columnId1: value, columnId2: value });
```

:::note[Note]
If there are more than one rows to be added to table then use
[addRows()](/lcnc-sdk-js/form/table/addrows/) instead for these bulk operations
:::
