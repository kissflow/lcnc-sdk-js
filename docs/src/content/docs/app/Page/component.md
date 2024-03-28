---
title: Component
description: Gives component instance and their methods
sidebar:
    order: 11
---

## Get component instance

This method lets you to retrieve a component instance

###### Syntax

```js
let componentInstance = await kf.app.page.getComponent(componentId);
```

###### Parameters

| Parameters  | type   | Description            |
| ----------- | ------ | ---------------------- |
| componentId | String | Unique Id of Component |

Returns a component instance with following methods

### Refresh

This methods lets you to refresh the component.

###### Syntax

```js
componentInstance.refresh();
```

### Hide

This method hides a component from page

###### Syntax

```js
componentInstance.hide();
```

### Show

This method renders a component that has been hidden previously in a page.

###### Syntax

```js
componentInstance.show();
```

## Component Specific methods

### OnMount

A lifecycle event for a component which will be called when component is mounted
/ re-mounted on page.

###### Syntax

```js
componentInstance.onMount(listenerFunction);
```

##### Example

```js
// Consider setting 2nd tab as active when tab component is mounted
componentInstance.onMount(() => {
	// function logic goes here...
	componentInstance.setActiveTab(2);
});
```

:::note[Note]
- Any component specific methods that are used on Page load must be called inside component's onMount event.
- The event `onMount` is applicable only for following components
:::

### 1. Tab

##### setActiveTab

The method can be used to set a specified tab index as active.

###### Parameters

| Parameters | type   | Description                  |
| ---------- | ------ | ---------------------------- |
| tabIndex   | Number | Index of tab starting from 1 |

###### Syntax

```js
componentInstance.setActiveTab(tabIndex);
```

###### Example

```js
// To set 2nd tab as active
componentInstance.setActiveTab(2);
```
