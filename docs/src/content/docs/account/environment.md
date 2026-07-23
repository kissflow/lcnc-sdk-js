---
title: Environment
description: Details about the environment the custom UI is running in
sidebar:
  order: 4
---

Access details about the environment the custom UI is running in.

### Properties

| Property | Type    | Description                                                                     |
| -------- | ------- | ------------------------------------------------------------------------------- |
| isMobile | Boolean | `true` when the UI is rendered inside Kissflow's mobile/PWA app, else `false`.   |

### Syntax

```js
const { isMobile } = kf.env;
```

### Returns

Returns an object describing the current runtime environment.

### Example

To render a compact layout when the custom UI runs inside the mobile app.

```js
const { isMobile } = kf.env;
if (isMobile) {
  renderCompactLayout();
}
```
