---
title: Page Parameters
description: Retrieve page parameters.
sidebar:
    order: 6
---

## getAllParameters()

To retrieve all parameters and their values on the page, use the
`getAllParameters()` method.

### Syntax

```js
let allParameters = await kf.app.page.getAllParameters();
```

### Return

Returns an object.

#### Example output

```json
{
	"parameterName": "Sample value",
	"parameterName2": "Sample value 2"
}
```

### Example scenario

In the context of an employee details page, these methods allow us to retrieve the value of the employee's ID input parameter.
We can then use this value to make API calls or fetch specific details about the employee.

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
