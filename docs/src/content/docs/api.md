---
title: APIs in SDK
description: Make internal and external API calls
sidebar:
  order: 2
---

In Kissflow SDKs, you can initiate both internal and external API calls.

For internal APIs, refer to the [Kissflow API documentation](https://api.kissflow.com/).

- You can use the `kf.api` method to fetch internal APIs.
- `kf.api` is equipped with default header tokens, ensuring secure and authenticated API calls.

:::note[Note]

- This method has a limit of 10 seconds for an api call
- For external API calls use,
  [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax)
  from javascript

:::

### Parameters

###### url (String)

Resoure URL for the REST API call to be fetched,

###### config (Object)

An object containing any custom settings you want to apply to the request. The
possible options

- ###### 1. method
  The request method, e.g., “GET”, “POST”, “DELETE”, etc., with the default being “GET”
- ###### 2. body

  Payload to be sent to an api as object.

  > Note: A request using the GET method cannot have a body.

### Syntax

```js
kf.api(url, config).then((res) => {...})
// or
let resp = await kf.api(url, config)
```

### Example

Consider a process form submission api.

```js
let payload = {
  fieldId1: "John Jacobs",
  fieldId2: “HR”
};
const options = { method: "POST", body: JSON.stringify(payload) };
kf.api(
  `/process/2/${kf.account._id}/process_id/instance_id/activity_instance_id/submit`,
  options
)
  .then((response) => console.log(response))
  .catch((err) => console.log(" An error has occurred.", err));

```
