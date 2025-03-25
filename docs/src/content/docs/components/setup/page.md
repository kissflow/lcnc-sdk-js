---
title: Page
description: Guide to installing Kissflow SDK
sidebar:
  order: 1 
---


## To create a custom page project,

```base
npm create kf-component
```

- Enter project's name.

- Choose `page`.

- Choose the framework `Reactjs` or `Vanillajs`.

Kissflow lets you build custom UI components and import them as reusable custom components in your app. You can build your components using plain HTML or frontend frameworks like React.

To make your component interact and communicate with your app, you can install the Kissflow SDK in your project. If you have an existing project, you can follow the instructions to install the SDK package.

## 1. Creating a new custom component

If you're starting a project from scratch, you can create a Kissflow custom component package using npm

```js
npm create kf-component
```

You will be prompted to provide a name for your component and choose between **HTML** or **React**. Once installed, run the following commands:

```js
cd componentname
npm install
npm run dev
```

Once development is done, you can use the **`npm run build`** command to build and compress the project into a zip file. You can then import this zip file directly into Kissflow as a custom component.

> This package is exclusively designed for the client side of your projects. Therefore, we only support ECMAScript modules (es modules) and Universal Module Definition (UMD) formats of javascript.


# NOTE: THIS IS NOT THE RECOMMENDED METHOD... The only use case for the below methods are 1. simplicity. 2. Non react/vite frameworks.

## 2. As `npm` module

If you have an existing project based on a framework like React that you wish to convert to a Kissflow custom component, you can install and import the Kissflow SDK as an `npm` module.

```js
npm install @kissflow/lowcode-client-sdk
```

> Note: Prerequisite: Node version 16+

### Usage:

Once the package is installed in your module, it can be imported and initialized as below:

```js
import KFSDK from "@kissflow/lowcode-client-sdk";
let kf;
(async function () {
  kf = await KFSDK.initialize();
})();
```

Note: Kissflow SDK has to be initialized before using its instance in any other files/modules in your project. Hence, it is recommended to initialize the SDK at the root or initial entry of your projects and use the same instance across your codebase.

## 3. As HTML/JS

If you are building your custom component in plain HTML and JS, you can import the SDK package into your HTML file.
The SDK package is imported as a `umd` file for ease of use inside HTML and vanilla javascript.

Import the package in your HTML:

```html
<script src="https://unpkg.com/@kissflow/lowcode-client-sdk@latest/dist/kfsdk.umd.js"></script>
```

And initialize it in the javascript file:

```js
let kf;
window.onload = async function () {
  kf = await window.kf.initialize();
};
```
