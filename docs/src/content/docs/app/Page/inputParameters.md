---
title: Page Parameters
description: Retrieve page parameters.
sidebar:
    order: 6
---

## getAllParameters()

This command retrieves all parameters on the page along with their values.

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

### Example

When an employee submits a request, you can pass the employee ID and leave details as the input parameters in an approval page. The approval page would then display the specific employee's information and leave request details for review.

## getParameter()

This command retrieves one of the page parameter values.

### Parameters

| Parameters  | Type   |
| ----------- | ------ |
| parameterId | String |

### Syntax

```js
let value = await kf.app.page.getParameter("parameterId");
```

### Return

Value of single page’s input parameter based on the parameter ID that was passed.

### Example
In a page that contains the information of all employees in an organization, pass a single person’s employee ID as the parameter ID to obtain information about that particular employee.
