---
title: Page
description: Installing and using custom components
sidebar:
    order: 2
---

Kissflow lets you build custom UI components and import them as reusable custom components in your app. You can use plain HTML or frontend frameworks like React to build your component. Read more to understand the SDK methods available inside custom components.

To learn about installing the Kissflow SDK inside custom components, follow [these](/lcnc-sdk-js/installation/) instructions.

### Watch Params

Listens for changes in parameter mapped to custom components inside page.

##### Example

```js
function onParamsChange(data) {
    console.info('Mapped data changes', data)
    // Your logic goes here
}
kf.context.watchParams(onParamsChange)
```

:::note[Note]

While using custom components, make sure `WatchParams` is called only once.

:::
