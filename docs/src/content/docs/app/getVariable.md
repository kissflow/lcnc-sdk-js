---
title: Get Variable
description: Retrieve value of variable.
sidebar:
    order: 2
---

This method lets you retrieve the value of a global variable used in the app.

-   Application variables are similar to variables in any programming language, with a scope spanning the entire user session within the application. 

-   Users can set variable values in pages, forms, or custom components, and retrieve it from other pages, forms, or custom components within the same application. 

:::note[Note] 
Value of application variable are stored on local machine of the user and
    they are always persisted, even if the application reloaded.
:::
### Parameters

| Parameters | type   |
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

This method can be used to retrieve the number of work hours an employee has logged in a particular week.
