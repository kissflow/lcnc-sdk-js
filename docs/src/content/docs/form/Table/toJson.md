---
title: to JSON
description: Retrieve data of given table as json
sidebar:
    order: 12
---

To retrieve data of given [table instance](/form/gettable/) as JSON.

### Syntax

```js
const json = await tableInstance.toJSON();
```

##### Example output

If your table has two columns, one denoting the candidate’s company name and the other, the duration of their employment there, the JSON output will be as follows:

```json
[
  {
    "table_field1": "Microsoft",
    "table_field2": “2 years”,
    "_id": "Row_Pk4_T1WGWuMe"
  },
  {
    "table_field1": "Amazon",
    "table_field2": “3 years”,
    "_id": "Row_Pk4_T1WMXuMd"
  }
]

```
