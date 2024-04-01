---
title: Get Parent
description: To perform form action over the main form
sidebar:
    order: 16
---

To carry out actions specific to the parent form. 

When working at the row level, use this method to refer to data from the primary parent form. Through the form’s interface that is returned, you can perform actions directly on the main form. 


### Syntax

```js
kf.context.getParent();
```
### Returns

Returns an instance of `Form` class using which we can perform any action on the
main form

#### Example

The accumulated years of experience in each organization is extracted from the employee work experience table, and subsequently, the total years of experience field in the parent form is updated. 

```js
let tableJSON = await worktableInstance.toJSON();
let totalYOE = 0;
tableJSON.forEach(data => totalYOE += data[“table_field2”])

let parentForm = await kf.context.getParent();
parentForm.update({"totalYOE":  totalYOE});

```