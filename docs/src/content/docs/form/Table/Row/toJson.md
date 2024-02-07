---
title: to JSON
description: Retrieve data of given row inside table as json
sidebar:
    order: 16
---

To retrieve data of current row as json

### Syntax

```js
const json = await kf.context.toJSON();
```

##### Example output

Consider your row have two columns, one text and another as rating

```json
{
	"columnId_Text": "row 1",
	"columnId_Rating": 2,
	"_flow_name": "form events",
	"_id": "Pk4_T1WGWuMe"
}
```
