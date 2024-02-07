---
title: Get Variable
description: Retrieve value of variable.
sidebar:
    order: 2
---

To Retrieve value of the application variable.

-   Application variables are just like variables in any programming languages,
    it has its scope(lifetime) for the entire app session of an user.
-   One can set a value of variable in a page/form/custom component and can
    retreive its value inside another page/form/custom component inside same
    application.
-   Value of application variable are stored on local machine of the user and
    they are always persisted, even if the application reloaded.

### Parameters

| Parameters | type   |
| ---------- | ------ |
| variableId | String |

### Syntax

```js
const appVarible1 = await kf.app.getVariable("variableId");
```

### Returns

Returns the value of variable, which could be of following data type in relation
with variable type.

| Variable type | Data type |
| ------------- | --------- |
| Text          | String    |
| Number        | Integer   |
| DateTime      | String    |
| Boolean       | Boolean   |
