# _Kissflow Lowcode JavaScript SDK_

This SDK package lets you build custom UI components and import them as reusable
custom components in your kissflow application. You can use plain HTML or
frontend frameworks like React to build your component.

If you are starting newly, you can create a Kissflow custom component package
using npm

```js
npm create kf-component
```

You’ll be prompted to provide a name for you component and choose between HTML
or React. Once installed, run the following commands:

```js
cd componentname
npm install
npm run dev
```

If you already have an existing project, you can follow these instructions to
install the SDK package.

1. As npm module

To install kissflow sdk as npm module, use

```js
npm install @kissflow/lowcode-client-sdk
```

Note: Prerequisite: Node version 16+

Usage: Once the package is installed on your module, then it can be imported and
initialized like

```js
import KFSDK from "@kissflow/lowcode-client-sdk";
let kf;
(async function () {
	kf = await KFSDK.initialize();
})();
```

> Note: Kf SDK has to be initialized before using its instance in any other
> files/modules in you project, hence it is recommended to initialize the sdk at
> root or inital entry of you projects and use the same instance across your
> codebase.

2. As HTML/JS 

Package is exported as umd file to ease usage inside HTML and vannila javascript.

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
