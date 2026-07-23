---
title: Get validation errors
description: Retrieve the form's current validation errors
sidebar:
  order: 15
---

Retrieves the current validation errors for the form, keyed by field.

:::note[Custom components only]
Available only on the Form instance returned by [`initForm()`](/app/board/initform/), not on the base Form (`kf.context`) in the Low-code / No-code SDKs.
:::

### Syntax

```js
const form = await kf.app.getDataform("EmpMaster").initForm("emp_123");
let errors = await form.getValidationErrors();
```

### Returns

Returns an object containing the form's current validation errors.
