---
title: About
description: Introduction to the Form's live-state methods
sidebar:
  order: 14
---

These methods expose the Form's live state — its current validation errors, its configuration/schema, and the current UI state of its fields.

1. [Get validation errors](/form/form-state/getvalidationerrors/)
2. [Get form configuration](/form/form-state/getformconfiguration/)
3. [Get field state](/form/form-state/getfieldstate/)

:::note[Custom components only]
These three methods are available only in custom components, on the Form instance returned by [`initForm()`](/app/board/initform/) (Board / Dataform / Process). They are not exposed on the base Form (`kf.context`) in the Low-code / No-code (Run Script) SDKs.
:::

```js
const form = await kf.app.getDataform("EmpMaster").initForm("emp_123");
const errors = await form.getValidationErrors();
```
