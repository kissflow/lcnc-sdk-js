---
title: Get Variable
description: Retrieve value of variable.
sidebar:
    order: 2
---

This command lets you retrieve the value of a global variable used in the app.

Global variables are similar to variables in any programming language. Users can set variable values in pages, forms, or custom components, and retrieve it from other pages, forms, or custom components within the same app. Once declared, a global variable stays in the app throughout the duration the app is running.

### Parameters

| Parameters | Type   |
| ---------- | ------ |
| variableId | String |

### Syntax

```js
const appVariable1 = await kf.app.getVariable("variableId");
```

### Returns

The above syntax will return the value of the variable, with data type corresponding to the variable type.

| Variable type | Data type |
| ------------- | --------- |
| Text          | String    |
| Number        | Integer   |
| DateTime      | String    |
| Boolean       | Boolean   |

### Example

This command can be used to retrieve the number of work hours an employee has logged in a particular week.
