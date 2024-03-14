---
title: Custom Components
description: Installing and using custom components
---
Kissflow lets you build custom UI components and import them as reusable custom components in your app. You can use plain HTML or frontend frameworks like React to build your component. 

To make your component interact and communicate with your app, you can install the Kissflow SDK in your project. If you already have an existing project, you can follow these instructions to install the SDK package.

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
