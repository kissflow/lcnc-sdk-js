---
title: Kissflow Lowcode JavaScript SDK
description: Introduction to KF SDK
---

Welcome to the Kissflow Lowcode JavaScript SDK repository! This SDK empowers
developers to seamlessly interact with the Kissflow low-code platform using
JavaScript.

## Usage

### 1. Inside Kissflow platform

Within the Kissflow environment, whether in the platform or inside apps, you have built-in support to use these SDKs directly wherever JavaScript events are available. You can access the SDKs using the `kf` namespace. 

Example:

```js
kf.client.showInfo("Welcome " + kf.user.Name);
```

### 2. In custom components 

This package has to be installed / imported, to use sdk on your codebase.

> This package is exclusively designed for the client side of your projects. So we only support ECMAScript modules (es modules) and Universal Module Definition (UMD) formats of javascript.


Please refer [installation](/lcnc-sdk-js/getting-started/installation/) steps
