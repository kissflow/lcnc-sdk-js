---
title: Utilities
description: Common utilities
---

### Account details

-   Account id can be accessed as

```js
kf.account._id;
```

### User details

-   Authenticated user details can be accessed as

```js
const { Name, Email, _id } = kf.user;
```

### API

-   Fetch [kissflow's internal APIs](https://developers.kissflow.com/) using
    this method.
-   `kf.api` has header tokens by default for making authenticated kissflow api
    calls

:::note[Note]

-   This method has a limit of 10 seconds for an api call
-   For external api calls use
    [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax)
    from javascript

:::

#### Parameters

###### url (String)

Resoure URL for the REST API call to be fetched,

###### config (Object)

An object containing any custom settings you want to apply to the request. The
possible options

-   ###### 1. method
    The request method, e.g., "GET", "POST", "DELETE", etc. The default is "GET"
-   ###### 2. body

    Payload to be sent to an api as object.

    Note that a request using the GET method cannot have a body.

##### Syntax

```js
kf.api(url, config).then((res) => {...})
// or
let resp = await kf.api(url, config)
```

##### Example

Consider a process form submission api.

```js
let payload = {
	fieldId1: "newValue",
	fieldId2: 22
};
const options = { method: "POST", body: JSON.strigify(payload) };
kf.api(
	`/process/2/${kf.account._id}/process_id/instance_id/activity_instance_id/submit`,
	options
)
	.then((response) => console.log(response))
	.catch((err) => console.log("some error occured", err));
```

### Client

#### Show Toast

```js
kf.client.showInfo(message);
```

#### Show confirm

Displays the confirmation dialog, and returns users's action as a response

```js
kf.client.showConfirm({ title, content }).then((action) => {
	if (action === "OK") {
		// user clicked ok button
	} else {
		// user clicked cancel button or clicked outside the popup
	}
});
```

#### Redirect to URL

```js
kf.client.redirect(url);
```
