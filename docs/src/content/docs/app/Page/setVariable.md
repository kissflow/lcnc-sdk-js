---
title: Set Local Variable
description: Updates new value to the local variable.
sidebar:
    order: 8
---

This method lets you to update a new value to local variables

### Parameters

| Parameters | type                        | Description                                                           |
| ---------- | --------------------------- | --------------------------------------------------------------------- |
| variableId | String                      | Unique Id of variable                                                 |
| value      | String or Number or Boolean | New value to variable                                                 |
| payload    | Object                      | Object with keys as variableId and its values in respective data type |

### Syntax

Follow the syntax to update a single variable:

```js
kf.app.page.setVariable(variableId, value);
```

Follow the syntax to update multiple variables:

```js
kf.app.page.setVariable({
	variableId: "new value",
	variableId2: 1
});
```

### Example scenario

Consider you have fetched employee details such as name, age & address during
the page's onload event. You can set local variables for all these fields and
use them on different components inside the page, such as displaying labels or cards.
