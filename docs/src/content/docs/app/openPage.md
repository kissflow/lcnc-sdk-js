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
kf.app.openPage("pageId");
```

### Returns

The above command does not return a [Page instance](/app/page/) — it resolves once the navigation request has been acknowledged. To interact with the opened page, retrieve its instance separately, for example via [`getComponent`](/app/page/component/).

### Example scenario

If you are working with a complex app such as the payroll or employee management app, you can use this command to quickly open a specific page, like the appraisal list.
