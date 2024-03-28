---
title: Installation
description: Guide to install Kissflow sdk
---
Kissflow lets you build custom UI components and import them as reusable custom components in your app. You can use plain HTML or frontend frameworks like React to build your component. 

To make your component interact and communicate with your app, you can install the Kissflow SDK in your project. If you already have an existing project, you can follow [these](/lcnc-sdk-js/intro/installation/) instructions to install the SDK package.

## 1. Creating a new custom component

If you're starting a project from scratch, you can create a Kissflow custom component package using npm
```js
npm create kf-component
```

You'll be prompted to provide a name for you component and choose between **HTML** or **React**. Once installed, run the following commands:

```js
cd componentname
npm install
npm run dev
```

Once development is done, you can use the **`npm run build`** command to build and compress the project into a zip file. You can then import this zip file direclty into Kissflow as a custom component.
> This package is exclusively designed for the client side of your projects. So we only support ECMAScript modules (es modules) and Universal Module Definition (UMD) formats of javascript.


## 2. As `npm` module

If you have an existing project based on a framework like React, which you wish to convert to Kissflow custom component, you can install and import the Kissflow SDK as an `npm` module


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


## 3. As HTML/JS

If you are building your custom component in plain HTML and JS, you can use import the sdk package into your html file.
The sdk package is exported as `umd` file to ease usage inside HTML and vannila javascript. 

Simply import the package in your html:
```html
<script src="https://unpkg.com/@kissflow/lowcode-client-sdk@latest/dist/kfsdk.umd.js"></script>
```
And initialize it on the javascript file:
```js
let kf;
window.onload = async function () {
	kf = await window.kf.initialize();
};
```
