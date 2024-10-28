---
title: Open Page
description: Opens a page inside application
sidebar:
    order: 4
---

This method lets you to open a page in an app

### Parameters

| Parameters | type   |
| ---------- | ------ |
| pageId     | String |

### Syntax

```js
const pageInstance = kf.app.openPage("pageId");
```

### Returns

Returns [Page instance](/app/page/)

### Example scenario

Suppose you want to redirect users to their respective pages based on their roles.

```js
let userRole = kf.user.Role.Name;

if (userRole === "Admin") {
	kf.app.openPage("Admin_page_id");
} else {
	kf.app.openPage("Non_Admin_");
}
```
