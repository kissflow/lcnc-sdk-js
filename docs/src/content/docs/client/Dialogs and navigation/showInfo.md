---
title: Show Toast
description: Display a toast message to the client
sidebar:
  order: 10
---

Displays a toast message to the client.

### Parameter

| Parameter | Type             | Description                                                              |
| --------- | ---------------- | ----------------------------------------------------------------------- |
| message   | String \| Object | The message to display. An object is serialized to JSON before display. |

### Syntax

```js
kf.client.showInfo(message).then(() => {...})
```

or

```js
await kf.client.showInfo(message);
```

### Returns

Returns a promise that resolves once the toast is shown.

### Example

To notify the client that a record was saved.

```js
await kf.client.showInfo("Record saved successfully");
```
