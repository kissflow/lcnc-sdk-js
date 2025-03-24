---
title: Set Variable
description: Updates new value to the variable.
sidebar:
  order: 3
---

This command lets you update the value of a global variable used in the app.

### Parameters

| Parameter  | Type                        | Description                                                            |
| ---------- | --------------------------- | ---------------------------------------------------------------------- |
| variableId | String                      | Unique Id of the variable.                                             |
| value      | String or Number or Boolean | New value to variable.                                                 |
| payload    | Object                      | Object with keys as variableId and its values in respective data type. |

### Syntax

Follow the below syntax to update a **single** global variable:

```js
kf.app.setVariable(variableId, value);
```

Follow the below syntax to update **_multiple_** variables:

```js
kf.app.setVariable({
  variableId: "new value",
  variableId2: 1,
});
```

### Example

This command can be used to update an employee’s personal information such as their dependants, contact number, and address that could be of varied variable types.
