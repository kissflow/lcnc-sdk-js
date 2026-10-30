---
title: Withdraw item
description: Withdraw a process instance (initiator only)
sidebar:
  order: 64
---

Withdraws a process instance. Only the initiator can withdraw.

### Parameters

| Parameters | Type   | Description        |
| ---------- | ------ | -------------------- |
| instanceId | String | Required.             |
| comment    | String | Optional.             |

### Syntax

```js
await processInstance.withdrawItem({ instanceId: "item_123", comment: "Withdrawing request" });
```
