---
title: Set Local Variable
description: Updates new value to the local variable.
sidebar:
  order: 8
---

This command lets you update a new value to local variables.

### Parameters

| Parameter  | Type                        | Description                                                            |
| ---------- | --------------------------- | ---------------------------------------------------------------------- |
| variableId | String                      | Unique Id of the variable.                                             |
| value      | String or Number or Boolean | New value to the variable.                                             |
| payload    | Object                      | Object with keys as variableId and its values in respective data type. |

### Syntax

Follow the syntax to update a single variable:

```js
kf.app.page.setVariable(variableId, value);
```

Follow the syntax to update multiple variables:

```js
kf.app.page.setVariable({
  variableId: "new value",
  variableId2: 1,
});
```

### Example

Consider you are an HR representative who wants to save a new email address for an employee. Before saving, the app needs to perform a validation check to see if the email already exists in the system.
In this scenario, a local variable can be set to store the new email address entered by the user during the time the validation process happens. Once the validation is complete and the employee’s new information is saved, the local variable can be released.

