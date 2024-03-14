---
title: Get Local Variable
description: Retrieve value of page variable.
sidebar:
    order: 7
---

To Retrieve value of the page / local variable.

-   Page variables have a limited scope and are specific to each page.
-   Unlike application variables, page variables are not persisted, so they are
    reinitialized each time the page is revisited.

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

### Example scenario

Suppose you have a implemented a custom voting counter component on a page. 
When a user submits their vote, you can retrieve the counter value and save this data.
