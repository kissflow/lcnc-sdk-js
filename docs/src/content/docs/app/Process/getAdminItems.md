---
title: Get admin items
description: Retrieve all items in a process (admin access required)
sidebar:
  order: 54
---

Retrieves all items in the process. Requires admin access.

### Parameters

| Parameters | Type   | Description                                                     |
| ---------- | ------ | -------------------------------------------------------------------|
| options    | Object | Optional. `searchValue`, `pageNumber`, `pageSize`, `payload`.        |

### Syntax

```js
const { items } = await processInstance.getAdminItems();
```
