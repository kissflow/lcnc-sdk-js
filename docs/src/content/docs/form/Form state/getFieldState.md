---
title: Get field state
description: Retrieve the current UI state of the form's fields
sidebar:
  order: 17
---

Retrieves the current state of the form's fields, such as their visibility, editability, and required status.

:::note[Custom components only]
Available only on the Form instance returned by [`initForm()`](/app/board/initform/), not on the base Form (`kf.context`) in the Low-code / No-code SDKs.
:::

### Syntax

```js
const form = await kf.app.getDataform("EmpMaster").initForm("emp_123");
let fieldState = await form.getFieldState();
```

### Returns

Returns an object describing the current state of the form's fields.
