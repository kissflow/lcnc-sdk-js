---
title: Open Page
description: Opens a page inside application
sidebar:
  order: 4
---

This command lets you open a specific page inside an app.

### Parameters

| Parameters | Type   |
| ---------- | ------ |
| pageId     | String |

### Syntax

```js
const pageInstance = kf.app.openPage("pageId");
```

### Returns

The above command returns the
[Page instance](/app/page/).

### Example scenario

If you are working with a complex app such as the payroll or employee management app, you can use this command to quickly open a specific page, like the appraisal list.
