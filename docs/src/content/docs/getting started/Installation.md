---
title: Installation
description: Guide to install Kissflow sdk
---


## 1. As `npm` module

To install kissflow sdk as npm module, use
```js
npm install @kissflow/lowcode-client-sdk
```
> Note: Prerequisite: Node version 16+


### Usage:
Once the package is installed on your module, then it can be imported and initialized like

```js
import KFSDK from "@kissflow/lowcode-client-sdk";
let kf;
(async function () {
	kf = await KFSDK.initialize();
})();
```

Note: Kf SDK has to be initialized before using its instance in any other files/modules in you project, hence it is recommended to initialize the sdk at root or inital entry of you projects and use the same instance across your codebase.


## 2. As HTML/JS

Package is exported as `umd` file to ease usage inside HTML and vannila javascript. 

Simply import the package in your html like
```html
<script src="https://unpkg.com/@kissflow/lowcode-client-sdk@latest/dist/kfsdk.umd.js"></script>
```
And initialize it on the javascript file like:
```js
let kf;
window.onload = async function () {
	kf = await window.kf.initialize();
};
```
