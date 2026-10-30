---
title: About
description: Access the current page's parameters, variables, components, and routing.
sidebar:
  order: 5
---

The command `kf.app.page` represents the active page that is currently open inside an app.

To retrieve the ID of a Page , use the command `kf.app.page._id`.

### Set route

Notifies the Kissflow host that the custom UI navigated to a given path, so the parent browser URL mirrors the route.

##### Parameters

| Parameters | Type   | Description                     |
| ---------- | ------ | ---------------------------------|
| path       | String | The route the custom UI navigated to. |

##### Syntax

```js
kf.app.page.setRoute("/employees/123");
```

:::note[Note]
This is primarily used by the App UI framework to keep the parent URL in sync with client-side routing inside a custom UI.
:::

### Get route

Returns the initial deep-link route the page was opened with.

##### Syntax

```js
const route = kf.app.page.getRoute();
```

##### Returns

Returns a String.
