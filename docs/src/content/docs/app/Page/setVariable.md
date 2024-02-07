---
title: Set Local Variable
description: Updates new value to the local variable.
sidebar:
    order: 8
---

To update a new value to page / local variables

### Parameters

| Parameters | type                        | Description                                                           |
| ---------- | --------------------------- | --------------------------------------------------------------------- |
| variableId | String                      | Unique Id of variable                                                 |
| value      | String or Number or Boolean | New value to variable                                                 |
| payload    | Object                      | Object with keys as variableId and its values in respective data type |

### Syntax

To update a single variable

```js
kf.app.page.setVariable(variableId, value);
```

To update multiple variables

```js
kf.app.page.setVariable({
	variableId: "new value",
	variableId2: 1
});
```
