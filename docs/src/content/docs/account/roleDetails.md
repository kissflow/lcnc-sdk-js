---
title: Role details
description: Retrieve assigned app roles
sidebar:
  order: 3
---

Retrieve assigned App roles. This property lists all of the roles assigned to the current user in an app.

### Syntax

```js
kf.user.AppRoles;
```

### Example

```js
console.log(kf.user.AppRoles);
```

### Returns

This property returns an array of roles assigned to the current user. Each role will have an ID and a name.

### Example

```js
[
  {
  "_id": "Ro9mhLyuEFn4",
  "Name": "Admin"
  },
  "_id": "Ro9mhI8Yy1_O",
  "Name": "Employee"
  },
  {
  "_id": "Ro9mhI8Y89df",
  "Name": "Test user"
  }
]
```

### Note

Use this property to return the first role in the list of roles assigned to a user
console.log(kf.user.AppRoles[0])

### Example

```js
  {
  "_id": "Ro9mhLyuEFn4",
  "Name": "Admin"
  }
```
