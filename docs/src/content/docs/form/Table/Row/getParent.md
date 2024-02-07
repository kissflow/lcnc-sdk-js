---
title: Get Field
description: To perform form action over the main form
sidebar:
    order: 16
---

To perform form actions on the main form

### Syntax

```js
kf.context.getParent();
```

#### Example

```js
// Access a value from parent form and update value in row from
let parentForm = await kf.context.getParent();
let count = parentForm.getField("someNumberField");
kf.context.updateField({ numericColumn: count + 1 });
```

### Returns

Returns an instance of `Form` class using which we can perform any action on the
main form
