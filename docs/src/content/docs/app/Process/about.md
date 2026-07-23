---
title: About
description: Introduction to Process SDK
sidebar:
  order: 50
---

Kissflow Process lets you build multi-step approval workflows made up of activities (steps), each assigned to a role or user.

Get a process instance using the `getProcess` method from app's interface.

### Parameters

| Parameters | Type   |
| ---------- | ------ |
| flowId     | String |

### Syntax

```js
const processInstance = kf.app.getProcess("flow_id");
```
