---
title: About
description: Access the current app, its flows, roles, and variables via kf.app.
sidebar:
  order: 1
---

There are several SDK methods that you can use to retrieve information from and about the app that is currently in use. Below are a few examples:

To get information about the current active instance of a Kissflow app, use `kf.app`.
To retrieve the app’s ID, use `kf.app._id.`

The command `kf.app` and its associated methods are accessible in the following:

- Forms within the app.
- Custom components.
- Across all widgets and popup events inside a page and other page events.
- Bulk and custom actions in dataforms inside the app.

### Get board

Returns a [Board](/app/board/about/) instance bound to the given flow, used to access board-flow item methods.

##### Parameters

| Parameters | Type   | Description                    |
| ---------- | ------ | --------------------------------- |
| flowId     | String | Unique Id of the board flow.        |

##### Syntax

```js
const boardInstance = kf.app.getBoard("flow_id");
```

### Get dataform

Returns a [Dataform](/app/dataform/about/) instance bound to the given flow, used to access dataform-flow item methods.

##### Parameters

| Parameters | Type   | Description                       |
| ---------- | ------ | ------------------------------------ |
| flowId     | String | Unique Id of the dataform flow.        |

##### Syntax

```js
const dataformInstance = kf.app.getDataform("flow_id");
```

### Get decision table

Returns a [Decision table](/app/decisiontable/) instance bound to the given flow, used to evaluate the decision table.

##### Parameters

| Parameters       | Type   | Description                            |
| ----------------- | ------ | ----------------------------------------- |
| flowId            | String | Unique Id of the decision table.            |

##### Syntax

```js
const decisionTableInstance = kf.app.getDecisionTable("flow_id");
```

### Get process

Returns a [Process](/app/process/about/) instance bound to the given flow, used to access process-flow item methods.

##### Parameters

| Parameters | Type   | Description                       |
| ---------- | ------ | ------------------------------------ |
| flowId     | String | Unique Id of the process flow.        |

##### Syntax

```js
const processInstance = kf.app.getProcess("flow_id");
```

### Get roles

Lists the app's roles and the subset the current user currently belongs to. Only available in a Development account — use it to build a role-picker UI, then pass the chosen role to [Switch role](#switch-role).

##### Syntax

```js
const { roles, currentRoles } = await kf.app.getRoles();
```

##### Returns

Resolves with an object `{ roles, currentRoles }`, where each role is `{ _id, Name }`.

##### Example

```js
const { roles, currentRoles } = await kf.app.getRoles();
console.log(roles);
// [{ _id: "Ro9mhLyuEFn4", Name: "Admin" }, { _id: "Ro9mhI8Yy1_O", Name: "Employee" }]
```

### Switch role

Switches the current user's active role. This performs a real role change — it removes the user from their current role(s) and adds them to the target role; the app shell picks up the change on its own, without a page reload. Only available in a Development account.

##### Parameters

| Parameters | Type   | Description                                                                          |
| ---------- | ------ | ---------------------------------------------------------------------------------------- |
| roleId     | String | Id of the target role. Use with values returned by [Get roles](#get-roles). Provide either `roleId` or `roleName`. |
| roleName   | String | Name of the target role. Alternative to `roleId`.                                        |

##### Syntax

```js
const { roles } = await kf.app.getRoles();
await kf.app.switchRole({ roleId: roles[1]._id });
```

##### Returns

Resolves with the switched-to role, `{ _id, Name }`.
