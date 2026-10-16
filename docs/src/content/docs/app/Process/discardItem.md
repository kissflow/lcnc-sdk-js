---
title: Discard item
description: Discard a draft process instance
sidebar:
  order: 69
---

Discards a draft process instance.

### Parameters

| Parameters | Type   | Description        |
| ---------- | ------ | -------------------- |
| instanceId | String | Required.             |

### Syntax

```js
await processInstance.discardItem({ instanceId: "item_123" });
```
