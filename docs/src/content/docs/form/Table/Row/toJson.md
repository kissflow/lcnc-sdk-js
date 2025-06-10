---
title: to JSON
description: Retrieve data of given row inside table as json
sidebar:
  order: 16
---

To retrieve the data of the current row in JSON format.

### Syntax

```js
const json = await rowInstance.toJSON();
```

##### Example output

If your row has two columns, one denoting the candidate’s company name and other, the duration of their employment there, the JSON output will be as follows:

```json
 {
    "table_field1": "Kissflow",
    "table_field2": “2 years”,
    "_id": "Row_Pk4_T1WGWuMe"
  }
```
