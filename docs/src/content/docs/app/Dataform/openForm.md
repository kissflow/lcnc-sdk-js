---
title: Open form
description: Open the form UI for a dataform item
sidebar:
  order: 42
---

Opens the form UI for an existing dataform item.

### Parameters

| Parameters | Type   | Description                                    |
| ---------- | ------ | ------------------------------------------------ |
| item       | Object | The dataform item to open, `{ _id, _view_id }`.    |

### Syntax

```js
dataformInstance.openForm({ _id: "item_123", _view_id: "EmpMaster_View" });
```
