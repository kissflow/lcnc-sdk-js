---
title: Page Parameters
description: Retrieve page parameters.
sidebar:
    order: 6
---

## getAllParameters()

To retrieve all parameters & its value on the page.

### Syntax

```js
let allParameters = await kf.app.page.getAllParameters();
```

### Return

Returns an object.

Example

```json
{
	"parameterName": "Sample value",
	"parameterName2": "Sample value 2"
}
```


## getParameter()

To retrieve one of page parameter's value.

### Parameters

| Parameters  | type   |
| ----------- | ------ |
| parameterId | String |

### Syntax

```js
let value = await kf.app.page.getParameter("parameterId");
```

### Return

Value of single page's input parameter

