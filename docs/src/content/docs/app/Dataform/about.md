---
title: About
description: Introduction to Dataform SDK
sidebar:
  order: 30
---

In Kissflow apps, dataforms gather and store data, enabling users to submit data into an app.

To begin with, get a dataform instance using the `getDataform` method from app's interface.

### Parameters

| Parameter  | Type   |
| ---------- | ------ |
| dataformId | String |

### Syntax

```js
let dataformInstance = kf.app.getDataform(dataformId);
```
