---
title: Redirect to URL
description: Redirect the client to a URL
sidebar:
  order: 12
---

Redirects the client to a specific URL within the Kissflow application or to an external URL.

### Parameter

| Parameter | Type   | Description                                                     |
| --------- | ------ | -------------------------------------------------------------- |
| url       | String | The URL to navigate to. Can be a Kissflow or an external URL.  |

### Syntax

```js
kf.client.redirect(url);
```

### Returns

Navigates the client to the given URL. No value is returned.

### Example

To redirect a client to a feedback form after they submit their data.

```js
kf.client.redirect("https://example.com/feedback");
```
