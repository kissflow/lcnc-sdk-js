---
title: Open form
description: Open the form UI for a board item
sidebar:
  order: 22
---

Opens the form UI for a board item.

### Parameters

| Parameters | Type   | Description                                    |
| ---------- | ------ | ------------------------------------------------ |
| item       | Object | The board item to open, `{ _id, _view_id }`.       |

### Syntax

```js
boardInstance.openForm({ _id: "item_123", _view_id: "AllItems_View" });
```
