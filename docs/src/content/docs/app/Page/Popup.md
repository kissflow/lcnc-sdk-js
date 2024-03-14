---
title: Popup
description: List of all component methods
sidebar:
    order: 10
---

-   The property `kf.app.page.popup` returns the active popup instance opened inside the page
-   The property `kf.app.page.popup._id` lets you the get ID of the popup
-   The method `kf.app.page.openPopup(id)` returns this popup class instance.

Following methods are available for a popup instance

## Popup parameters

### getAllParameters()

To retrieve all parameters & its value of popup.

###### Syntax

```js
let allParameters = await kf.app.page.popup.getAllParameters();
```

###### Returns

Returns an object.

Example

```json
{
	"parameterName": "Sample value",
	"parameterName2": "Sample value 2"
}
```

### getParameter()

To retrieve one of popup parameter's value.

###### Parameters

| Parameters  | type   |
| ----------- | ------ |
| parameterId | String |

###### Syntax

```js
let value = await kf.app.page.popup.getParameter("parameterId");
```

## Close popup

Closes an active popup that is currently open in the page

###### Syntax

```js
kf.app.page.popup.close();
```

or If you already have popupInstance from `openPopup()` method

```js
popupInstance.close();
```
