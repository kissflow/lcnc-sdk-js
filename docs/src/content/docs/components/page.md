---
title: Page component
description: Installing and using custom page components
sidebar:
  order: 2 
---

Kissflow lets you build page UI components and import them as reusable page components in your app. You can use plain HTML or frontend frameworks like React to build your custom component.

## 1. Creating a new custom component

If you're starting a project from scratch, you can create a Kissflow custom component package using npm

```bash
npx create-kf-component@latest
```

You will be prompted to provide a name for your component and choose between **HTML** or **React**. Once installed, run the following commands:

```bash
cd componentname
npm install
npm run dev
```

Once development is done, you can use the **`npm run build`** command to build and compress the project into a zip file. You can then import this zip file directly into Kissflow as a custom component.

> This package is exclusively designed for the client side of your projects. Therefore, we only support ECMAScript modules (es modules) and Universal Module Definition (UMD) formats of JavaScript.



## 2. As `npm` module

If you have an existing project based on a framework like React that you wish to convert to a Kissflow custom component, you can install and import the Kissflow SDK as an `npm` module.

```bash
npm install @kissflow/lowcode-client-sdk
```

> Prerequisite: Node version 16 and above.

> Note: This is an alternative method that you can use if you are working with Non-React/Vite frameworks. However, we recommend using the first method.

### Usage:

Once the package is installed in your module, it can be imported and initialized as below:

```js
import KFSDK from "@kissflow/lowcode-client-sdk";
let kf;
(async function () {
  kf = await KFSDK.initialize();
})();
```

> Note: Kissflow SDK has to be initialized before using its instance in any other files/modules in your project. Hence, it is recommended to initialize the SDK at the root or initial entry of your projects and use the same instance across your codebase.

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


## Using input parameters with a custom page component

You must include the Watch params function in your custom page component's code for the input parameters created in the Kissflow UI to work with your component. Below is the syntax for it:

### Watch Params

Listens for changes in parameter mapped to page components inside page.

##### Example

```js
function onParamsChange(data) {
  console.info("Mapped data changes", data);
  // Your logic goes here
}
kf.context.watchParams(onParamsChange);
```

:::note[Note]

While using page components, make sure `WatchParams` is called only once.

:::
