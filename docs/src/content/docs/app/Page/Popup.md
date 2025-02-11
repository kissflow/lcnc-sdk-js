---
title: Popup
description: List of all component methods
sidebar:
    order: 10
---

-   The property `kf.app.page.popup` returns the active popup instance opened inside the page.
-   The property `kf.app.page.popup._id` lets you the get ID of the popup.
-   The method `kf.app.page.openPopup(id)` returns this popup class instance.

Following methods are available for a popup instance:

## Open popup

This command lets you open a popup in a page.

### Parameters

| Parameter                  | Type   | Description                         |
| --------------------------- | ------ | ----------------------------------- |
| popupId                     | String | Unique ID of the popup.                  |
| popupParameters (optional) | Object | Specify popup parameters as objects. |

### Syntax

```js
kf.app.page.openPopup(popupId, popupParameters);
```

#### Example

```js
let popupParameters = {
	instanceId: "acdnd",
	activityInstanceId: "mnop"
};
kf.app.page.openPopup("popup1", popupParameters);
```

:::note[Note]
Popup parameters are optional. 
:::

### Returns

Returns an instance of [Popup](/https://developers.kissflow.com/app/page/popup/).


## Popup parameters

### getAllParameters()

This command retrieves all parameters and their pop up values.

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
Consider you are clicking on an edit button next to an employee's name in the employee list. This opens a pop-up window to edit the employee's details.
You can control the visibility of certain elements within the pop-up based on the employee's role or department. For example, if the employee belongs to the "Sales" department, you could display a section for managing sales targets within the edit pop-up. This section would be hidden for employees from other departments.


### getParameter()

This command retrieves one of the popup parameter’s values.

###### Parameters

| Parameter  | Type   |
| ----------- | ------ |
| parameterId | String |

###### Syntax

```js
let value = await kf.app.page.popup.getParameter("parameterId");
```

## Close popup

This command closes an active popup that is currently open in the page.

###### Syntax

```js
kf.app.page.popup.close();
```

If you already have a popupInstance open using the openPopup() method, then use the following:
```js
popupInstance.close();
```
