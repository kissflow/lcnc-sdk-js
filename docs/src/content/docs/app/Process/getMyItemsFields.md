---
title: Get my items fields
description: Retrieve field definitions for the "my items" view, filtered by status
sidebar:
  order: 73
---

Retrieves field definitions for the "my items" view, filtered by status.

### Parameters

| Parameters | Type   | Description                                          |
| ---------- | ------ | ------------------------------------------------------|
| status     | String | Required. For example `"draft"`, `"inprogress"`, `"all"`. |

### Syntax

```js
const fields = await processInstance.getMyItemsFields({ status: "draft" });
```
