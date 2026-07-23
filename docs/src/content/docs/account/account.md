---
title: Account details
description: Access the current account details
sidebar:
  order: 1
---

Access details about the current Kissflow account the custom UI is running in.

### Syntax

`_id` returns the current account ID.

```js
kf.account._id;
```

### Returns

Returns the account ID as a string.

### Example

```js
console.log(kf.account._id);
```

#### Output

```js
"Ac_kf_prod_01";
```
