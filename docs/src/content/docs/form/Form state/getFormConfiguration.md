---
title: Get form configuration
description: Retrieve the form's configuration
sidebar:
  order: 16
---

Retrieves the form's configuration, including its field definitions and layout.

:::note[Custom components only]
Available only on the Form instance returned by [`initForm()`](/app/board/initform/), not on the base Form (`kf.context`) in the Low-code / No-code SDKs.
:::

### Syntax

```js
const form = await kf.app.getDataform("EmpMaster").initForm("emp_123");
let configuration = await form.getFormConfiguration();
```

### Returns

Returns an object describing the form's configuration.
