---
title: Open file preview
description: Open the platform's file preview lightbox
sidebar:
  order: 22
---

Opens the platform's file preview (lightbox) for one or more files. The preview UI natively renders next/prev navigation across the array.

### Parameter

| Parameter | Type   | Description                                              |
| --------- | ------ | ------------------------------------------------------- |
| args      | Object | Preview configuration. See the properties listed below. |

The `args` object accepts the following properties:

| Property    | Type     | Description                                                                                     |
| ----------- | -------- | ---------------------------------------------------------------------------------------------- |
| files       | Object[] | Array of file metadata objects to preview. Pass a single-element array for single-file fields. |
| indexOfFile | Number   | Index of the file to open the preview on (default: `0`).                                       |

### Syntax

```js
kf.client.openFilePreview(args).then(() => {...})
```

or

```js
await kf.client.openFilePreview(args);
```

### Returns

Returns a promise that resolves once the user closes the preview.

### Example

To preview a single image field value.

```js
await kf.client.openFilePreview({ files: [imageFieldValue] });
```

To preview a multi-file attachment field, opening on the third file.

```js
await kf.client.openFilePreview({ files: attachmentFieldValue, indexOfFile: 2 });
```
