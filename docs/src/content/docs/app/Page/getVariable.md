---
title: Get Local Variable
description: Retrieve value of page variable.
sidebar:
  order: 7
---

This command lets you retrieve the value of a local variable.

- The scope of page variables are limited to the page they are declared in.
- Page variables do not persist like global variables, therefore revisiting a page will reinitialize all of its page variables.

### Parameters

| Parameter  | Type   |
| ---------- | ------ |
| variableId | String |

### Syntax

```js
const pageVariable1 = await kf.app.page.getVariable("variableId");
```

### Returns

Returns the value of variable, which could be of the following data type in relation
with the variable type.

| Variable type | Data type |
| ------------- | --------- |
| Text          | String    |
| Number        | Integer   |
| DateTime      | String    |
| Boolean       | Boolean   |

### Example

Local variables can be used to store the individual ratings given for different criteria (e.g., communication, teamwork) within the performance review form. Using local variables for the individual ratings would make it easier to calculate the final rating for performance evaluation.

