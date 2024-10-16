---
title: Utilities
description: Common utilities
---
While integrating SDKs, the initial step involves defining the account and user details. 

Use the below functions to invoke the respective details.


### Account details

-   You can obtain the account ID using 

```js
kf.account._id;
```

### User details

-   You can access the authenticated user details using

```js
const { Name, Email, _id, Role } = kf.user;
```

### APIs in SDK

In Kissflow SDKs, you can initiate both internal and external API calls. 

For internal APIs, refer to the [Developer's Hub](https://api.kissflow.com/).


-   You can use the `kf.api` method to fetch internal APIs.
-   `kf.api` is equipped with default header tokens, ensuring secure and authenticated API calls. 

:::note[Note]

-   This method has a limit of 10 seconds for an api call
-   For external API calls use,
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
	The request method, e.g., “GET”, “POST”, “DELETE”, etc., with the default being “GET”
-   ###### 2. body

    Payload to be sent to an api as object.

    > Note: A request using the GET method cannot have a body.

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

### Client methods

#### Show Toast

Displays the configured toast message to the clients.

```js
kf.client.showInfo(message);
```

#### Show confirm

Displays the confirmation dialog to the client and returns the client's response as an output.

```js
kf.client.showConfirm({ title, content }).then((action) => {
	if (action === "OK") {
		// user clicked ok button
	} else {
		// user clicked cancel button or clicked outside the popup
	}
});
```

#### Example
To configure a confirmation dialog for every form submission

```js
kf.client.showConfirm({
     title: "Submit form",
     content: "Are you sure you want to submit the form",
     okText: "Continue",
     cancelText: "Cancel"
   })
   .then(function(result) {
     if (result === "OK") {
			//code block to be executed if the user confirmed   
	 	}else {
			//code block to be executed if the user cancelled
			}
   });
```


#### Redirect to URL

Redirects the client to a specific URL in the Kissflow application or to an external url. 

```js
kf.client.redirect(url);
```
#### Example
To redirect a client to a feedback form post submitting their data, you can add the redirection URL to the above syntax. 
