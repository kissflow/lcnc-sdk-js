---
title: Open Popup
description: Opens a popup in the page
sidebar:
    order: 9
---

To open a popup in page

### Parameters

| Parameters                  | type   | Description                         |
| --------------------------- | ------ | ----------------------------------- |
| popupId                     | String | Unique Id of Popup                  |
| popupParameters ?(optional) | Object | specify popup parameters as objects |

### Syntax

```js
kf.app.page.openPoup(popupId, popupParameters);
```

#### Example
Consider there is a process form inside Popup and popup parameters are mapped to instance and activity instance id property of the process form.
In such case we can pass in those values as popup parameters
```js
let popupParameters = {
	instanceId: "acdnd",
	activityInstanceId: "mnop"
};
kf.app.page.openPopup("popup1", popupParameters);
```

:::note[Note]
Popup parameters are optional 
:::

### Returns

Returns a instance of [Popup](/lcnc-sdk-js/app/page/popup/)
