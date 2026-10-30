---
title: Open file picker
description: Open the platform's file picker
sidebar:
  order: 21
---

Opens the platform's file picker, uploads the selected file(s), and resolves with an array of the uploaded files' metadata. The upload runs in the parent window, so custom components can upload without direct access to the authenticated upload endpoints.

### Parameter

| Parameter | Type   | Description                                                    |
| --------- | ------ | ------------------------------------------------------------- |
| options   | Object | File picker configuration. See the properties listed below.   |

The `options` object accepts the following properties:

| Property       | Type     | Description                                                              |
| -------------- | -------- | ----------------------------------------------------------------------- |
| fileExtensions | String[] | Allowed file extensions, e.g. `["JPG", "PNG"]`.                         |
| maxSize        | Number   | Maximum allowed file size, in bytes.                                    |
| maxCount       | Number   | Maximum number of files that can be selected.                          |
| imageProps     | Object   | Image constraints — `sizes` (`[width, height]` pairs) and `crop` flag. |

### Syntax

```js
kf.client.openFilePicker(options).then((files) => {...})
```

or

```js
const files = await kf.client.openFilePicker(options);
```

### Returns

Returns a promise that always resolves with an array of the uploaded files' metadata objects (each including `key`, `name`, `size`, `photos`, etc.). Resolves with `[]` if the picker is closed without completing any upload.

### Example

To upload a single image and pass it to the field's change handler.

```js
const files = await kf.client.openFilePicker({ fileExtensions: ["JPG", "PNG"], maxCount: 1 });
if (files.length) onChange(files[0]);
```

To upload multiple attachments.

```js
const files = await kf.client.openFilePicker({ maxCount: 10 });
if (files.length) onChange([...existing, ...files]);
```
