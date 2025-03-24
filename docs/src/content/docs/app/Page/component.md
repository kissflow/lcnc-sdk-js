---
title: Component
description: Gives component instance and their methods
sidebar:
  order: 11
---

## Get component instance

This command lets you retrieve a component instance.

###### Syntax

```js
let componentInstance = await kf.app.page.getComponent(componentId);
```

###### Parameters

| Parameter   | Type   | Description                 |
| ----------- | ------ | --------------------------- |
| componentId | String | Unique ID of the Component. |

Returns a component instance with following methods:

### Refresh

This command refreshes a given component.

###### Syntax

```js
componentInstance.refresh();
```

### Hide

This command hides a component from a page.

###### Syntax

```js
componentInstance.hide();
```

### Show

This command renders a component that has been hidden previously in a page.

###### Syntax

```js
componentInstance.show();
```

## Component Specific methods

### OnMount

A lifecycle event for a component which will be called when component is mounted or re-mounted on page.

###### Syntax

```js
componentInstance.onMount(listenerFunction);
```

##### Example

```js
// Consider setting second tab as active when tab component is mounted.
componentInstance.onMount(() => {
  // function logic goes here...
  componentInstance.setActiveTab(2);
});
```

:::note[Note]

- Any component specific methods that are used on Page load must be called inside component's onMount event.
- The event `onMount` is applicable only for following components.
  :::

### 1. Tab

##### setActiveTab

This command sets a specific tab index as active.

###### Parameters

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| tabIndex  | Number | Index of tab starting from 1 |

###### Syntax

```js
componentInstance.setActiveTab(tabIndex);
```

###### Example

```js
// To set second tab as active
componentInstance.setActiveTab(2);
```
