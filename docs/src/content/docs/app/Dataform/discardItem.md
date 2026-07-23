---
title: Discard item
description: Discard the current dataform draft
sidebar:
  order: 38
---

Discards the current draft for the dataform.

### Parameters

| Parameters | Type   | Description                    |
| ---------- | ------ | -------------------------------- |
| options    | Object | Optional. `viewId` (String).      |

### Syntax

```js
await dataformInstance.discardItem();
```

> Note
>
> Unlike [`Board`'s Discard item](/app/board/discarditem/), no item Id is required here — this discards the current draft.
