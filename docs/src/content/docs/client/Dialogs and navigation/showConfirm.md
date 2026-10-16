---
title: Show confirm
description: Display a confirmation dialog to the client
sidebar:
  order: 11
---

Displays a confirmation dialog to the client and returns the client's response.

### Parameter

| Parameter | Type   | Description                                             |
| --------- | ------ | ------------------------------------------------------ |
| args      | Object | Dialog configuration. See the properties listed below. |

The `args` object accepts the following properties:

| Property   | Type   | Description                                       |
| ---------- | ------ | ------------------------------------------------- |
| title      | String | The dialog title.                                 |
| content    | String | The body text of the dialog.                      |
| okText     | String | Label for the confirm button (default: `"Ok"`).   |
| cancelText | String | Label for the cancel button (default: `"Cancel"`). |

### Syntax

```js
kf.client.showConfirm({ title, content, okText, cancelText }).then(({ action }) => {...})
```

or

```js
const { action } = await kf.client.showConfirm({ title, content });
```

### Returns

Returns a promise that resolves with an object `{ action }`, where `action` is `"OK"` when the user confirms, or `"CANCEL"` when the user cancels or dismisses the dialog.

### Example

To configure a confirmation dialog before submitting a form.

```js
kf.client
  .showConfirm({
    title: "Submit form",
    content: "Are you sure you want to submit the form?",
    okText: "Continue",
    cancelText: "Cancel",
  })
  .then(function ({ action }) {
    if (action === "OK") {
      // code block to be executed if the user confirmed
    } else {
      // code block to be executed if the user cancelled
    }
  });
```

#### Output

```js
{ action: "OK" }
```
