---
title: Open scanner
description: Open the platform's barcode/QR scanner
sidebar:
  order: 30
---

Opens the platform's barcode/QR scanner and resolves with the decoded text. The scanner UI (camera stream and decoding) runs in the parent window, which owns the camera permission.

:::note[Note]
Currently supported in web custom app UIs only; the mobile (PWA) custom UI doesn't host the scanner yet.
:::

### Parameter

| Parameter | Type   | Description                                             |
| --------- | ------ | ------------------------------------------------------ |
| options   | Object | Scanner configuration. See the properties listed below. |

The `options` object accepts the following properties:

| Property      | Type    | Description                                                              |
| ------------- | ------- | ----------------------------------------------------------------------- |
| localFileScan | Boolean | Allow decoding from an uploaded image instead of the camera (default: `false`). |

### Syntax

```js
kf.client.openScanner(options).then((code) => {...})
```

or

```js
const code = await kf.client.openScanner(options);
```

### Returns

Returns a promise that resolves with the decoded string, or `null` if the scanner is closed without a successful scan (including the scanner's own inactivity timeout).

### Example

To scan a barcode, also allowing decoding from an uploaded image.

```js
const code = await kf.client.openScanner({ localFileScan: true });
if (code) onChange(code);
```
