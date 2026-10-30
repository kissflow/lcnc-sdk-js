---
title: User details
description: Access the authenticated user's details
sidebar:
  order: 2
---

Access the details of the currently authenticated user.

### Properties

| Property | Type   | Description                       |
| -------- | ------ | --------------------------------- |
| Name     | String | The current user's display name.  |
| Email    | String | The current user's email address. |
| \_id     | String | The current user's unique ID.     |

### Syntax

```js
const { Name, Email, _id } = kf.user;
```

### Returns

Returns the current user's `Name`, `Email`, and `_id`. See [Role details](/account/roledetails/) for the roles assigned to this user.

### Example

```js
console.log(kf.user.Name, kf.user.Email, kf.user._id);
```

#### Output

```js
"John Jacobs", "john@kissflow.com", "Us9mhLyuEFn4";
```
