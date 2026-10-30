---
title: Get image URL
description: Resolve an image field value to a base64 data URL
sidebar:
  order: 20
---

Resolves a Kissflow image field value to a base64 data URL that can be used directly as an `<img src>`. This is useful for previewing images inside custom components, which cannot load Kissflow-hosted images directly due to CORS restrictions.

### Parameter

| Parameter  | Type   | Description                                                                                             |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------ |
| imageValue | Object | The image field value. Must contain a `key` property, and optionally a `photos` array for the preview. |

### Syntax

```js
kf.client.getImageUrl(imageValue).then((dataUrl) => {...})
```

or

```js
const dataUrl = await kf.client.getImageUrl(imageValue);
```

### Returns

Returns a promise that resolves with the base64 data URL string (`data:image/...;base64,...`).

### Example

To preview an image field value inside a custom component.

```js
const dataUrl = await kf.client.getImageUrl(imageFieldValue);
document.querySelector("#avatar").src = dataUrl;
```
