---
title: Set Variable
description: Updates new value to the variable.
sidebar:
    order: 3
---

To update a new value for an application variable.

### Parameters

| Parameters | type                        | Description                                                           |
| ---------- | --------------------------- | --------------------------------------------------------------------- |
| variableId | String                      | Unique Id of variable                                                 |
| value      | String or Number or Boolean | New value to variable                                                 |
| payload    | Object                      | Object with keys as variableId and its values in respective data type |

### Syntax

To update a single variable

```js
kf.app.setVariable(variableId, value);
```

To update multiple variables

```js
kf.app.setVariable({
	variableId: "new value",
	variableId2: 1
});
```
