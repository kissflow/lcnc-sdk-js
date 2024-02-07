---
title: Open Popup
description: Opens a popup in the page
sidebar:
    order: 9
---

To open a popup in page

### Parameters

| Parameters       | type   | Description                         |
| ---------------- | ------ | ----------------------------------- |
| popupId          | String | Unique Id of Popup                  |
| popupParameters? | Object | specify popup parameters as objects |

### Syntax

```js
kf.app.page.openPoup(popupId, popupParameters);
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
Popup parameters are optional 
:::

### Returns

Returns a instance of [Popup](/lcnc-sdk-js/app/page/popup/)
