---
title: Environment
description: Details about the environment the SDK is running in
sidebar:
  order: 4
---

Access details about the environment the SDK is running in.

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

To render a compact layout when running inside the mobile app.

```js
const { isMobile } = kf.env;
if (isMobile) {
  renderCompactLayout();
}
```
