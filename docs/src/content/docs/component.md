---
title: Custom Components
description: Installing and using custom components
---
Kissflow lets you build custom UI components and import them as reusable custom components in your app. You can use plain HTML or frontend frameworks like React to build your component. 


If you already have an existing project, you can follow these [instructions](/lcnc-sdk-js/installation/) to install the SDK package.

If you don't have an existing project, you can create a Kissflow custom component package using npm
```js
npm create kf-component
```

You'll be prompted to provide a name for you component and choose between HTML or React. Once installed, run the following commands:

```js
cd componentname
npm install
npm run dev
```

### Watch Params

Listens for changes in parameter mapped to custom components inside page.

##### Example

```js
function onParamsChange(data) {
	console.info("Mapped data changes", data);
	// Your logic goes here
}
kf.context.watchParams(onParamsChange);
```

:::note[Note]

While using custom components make sure WatchParams is called only once. 

:::
