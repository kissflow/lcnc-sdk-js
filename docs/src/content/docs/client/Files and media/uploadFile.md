---
title: Upload file
description: Upload an in-memory File or Blob
sidebar:
  order: 23
---

Uploads a `File`/`Blob` you already have in memory (for example, a canvas drawing converted to a PNG blob) to Kissflow's storage, without opening a file picker UI.

### Parameters

| Parameter | Type          | Description                                        |
| --------- | ------------- | ------------------------------------------------- |
| file      | File \| Blob  | The file to upload.                               |
| fileName  | String        | Optional file name override (defaults to `file.name`). |

### Syntax

```js
kf.client.uploadFile(file, fileName).then((result) => {...})
```

or

```js
const result = await kf.client.uploadFile(file, fileName);
```

### Returns

Returns a promise that resolves with the uploaded file's metadata object (`{ key, name, ... }` — the same shape returned by [`openFilePicker`](/client/files-and-media/openfilepicker/)), or `null` if the upload fails.

### Example

To upload a canvas drawing as a signature image.

```js
const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
const file = new File([blob], "signature.png", { type: "image/png" });
const result = await kf.client.uploadFile(file);
if (result) onChange(result);
```
