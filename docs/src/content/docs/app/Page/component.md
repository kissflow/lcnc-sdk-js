---
title: Component
description: Retrieves component instance
sidebar:
    order: 11
---

## Get component instance

To retrieve a component instance

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

Refreshes the given component.

###### Syntax

```js
componentInstance.refresh();
```

### Hide

Hides the component from page

###### Syntax

```js
componentInstance.hide();
```

### Show

Renders component in the page, if its been hidden previously.

###### Syntax

```js
componentInstance.show();
```

## Component Specific methods

### OnMount

A lifecycle event for component which will be called when component is mounted /
re-mounted on page.

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

> ###### Note: Any component specific methods that are used on Page load must be called inside component's onMount event.

`onMount` is applicable only for following components

### 1. Tab

##### setActiveTab

Sets specified tab index as active.

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
componentInstance.setActiveTab(2)
```
