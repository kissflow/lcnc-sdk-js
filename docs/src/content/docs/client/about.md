---
title: About
description: Interact with the client — dialogs, navigation, files, and device capture
sidebar:
  order: 0
---

`kf.client` provides methods to interact with the client running your custom UI — showing dialogs and toasts, navigating, working with files and media, and invoking device capabilities like the scanner and map picker.

The available methods are grouped by capability:

### Dialogs and navigation

- [`showInfo()`](/client/dialogs-and-navigation/showinfo/) — display a toast message
- [`showConfirm()`](/client/dialogs-and-navigation/showconfirm/) — display a confirmation dialog
- [`redirect()`](/client/dialogs-and-navigation/redirect/) — redirect the client to a URL

### Files and media

- [`getImageUrl()`](/client/files-and-media/getimageurl/) — resolve an image field value to a data URL
- [`openFilePicker()`](/client/files-and-media/openfilepicker/) — open the platform's file picker
- [`openFilePreview()`](/client/files-and-media/openfilepreview/) — open the file preview lightbox
- [`uploadFile()`](/client/files-and-media/uploadfile/) — upload an in-memory `File`/`Blob`

### Device capture

- [`openScanner()`](/client/device-capture/openscanner/) — open the barcode/QR scanner
- [`pickLocation()`](/client/device-capture/picklocation/) — open the map picker
