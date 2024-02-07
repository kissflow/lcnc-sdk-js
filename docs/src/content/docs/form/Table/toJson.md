---
title: to JSON
description: Retrieve data of given table as json
sidebar:
    order: 12
---

To retrieve data of given [table instance](/lcnc-sdk-js/form/gettable/). as json

### Syntax

```js
const json = await tableInstance.toJSON();
```

##### Example output

Consider your table have two columns, one text and another as rating

```json
[
	{
		"columnId_Text": "row 1",
		"columnId_Rating": 2,
		"_flow_name": "form events",
		"_id": "Pk4_T1WGWuMe"
	},
	{
		"columnId_Text": "row 2",
		"columnId_Rating": 3,
		"_flow_name": "form events",
		"_id": "Pk4_T1WGWuMe"
	}
]
```
