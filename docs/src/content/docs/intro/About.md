---
title: Kissflow Lowcode JavaScript SDK
description: Introduction to KF SDK
---

Welcome to the Kissflow Lowcode JavaScript SDK repository! This SDK empowers
developers to seamlessly interact with the Kissflow low-code platform using
JavaScript.

## Usage

### 1. Inside Kissflow platform

Kissflow platform have inbuilt support for this sdk, therefore this can be
accessed easily by using namespace `kf` where-ever the coding support has been
provided inside the platform

Example:

```js
kf.client.showInfo("Welcome " + kf.user.Name);
```

### 2. Using SDK in your own codebase

This package has to be installed / imported, to use sdk on your codebase.

> Note: Since this package is only for client side of your projects, we have
> support only for `esm` (es modules) and `umd` formats of javascript.

Please refer [installation](/lcnc-sdk-js/getting-started/installation/) steps
