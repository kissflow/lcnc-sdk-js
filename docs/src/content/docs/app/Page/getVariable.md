---
title: Get Local Variable
description: Retrieve value of page variable.
sidebar:
    order: 7
---

To Retrieve value of the page / local variable.

-   Page variables have its scope limited to page.
-   Page variables are not persisted like application variable, hence revisiting
    the page will reinitialize all of its page variables

### Parameters

| Parameters | type   |
| ---------- | ------ |
| variableId | String |

### Syntax

```js
const pageVariable1 = await kf.app.page.getVariable("variableId");
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
