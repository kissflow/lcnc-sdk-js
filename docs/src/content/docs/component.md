---
title: page Components
description: Installing and using page components
---
Kissflow lets you build page UI components and import them as reusable page components in your app. You can use plain HTML or frontend frameworks like React to build your component. Read more to understand the SDK methods available inside page components. 

To learn about installing the Kissflow SDK inside page components, follow [these](/lcnc-sdk-js/installation/) instructions.


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
