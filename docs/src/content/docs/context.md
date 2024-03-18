---
title: Context
description: Context usage
---

The `kf.context` method lets you access specific method based on the entity
where you're using it.

Context methods are polymorphic, it has different classes pre-initialized based
on execution context.

For example, if you're calling `kf.context` inside, you'll be able to access
methods such as `getFields`, `updateFields`, `getTable`, etc.

Below are the places where you can use `kf.context`

### Custom components

When `kf.context` is used inside a custom component code, `watchParams` method
can be used to subscribe for the changes happen through mapped params

Please refer more about [`watchParams` here](/lcnc-sdk-js/component#watch-params)

### Form

When `kf.context` is used inside a form events, it refers to the Form instance
from which we can get and update fields and retrieve table etc.

```js
let fieldId = "Purchase_request_number";
let requestNumber = await kf.context.getField(fieldId);
```

Please refer more about [Forms and its methods](/lcnc-sdk-js/form/about/)


### Child table's Row

When `kf.context` is used inside a row's field event, it considers the entire
row as project.

```js
let columnId = "Quantity_of_Product";
let quantity = await kf.context.getField(columnId);
```
Please refer more about [Rows and its methods](/lcnc-sdk-js/form/table/row/)

### Page (onLoad, unLoad)

When `kf.context` is used inside a page on load and unload event, the methods
such as getParameter, setVariable, getVariables can be accessed from it.

```js
// Make some api call and change the local variable based on that
kf.context.updateVariable("variableName", "some value");
```
Please refer more about [Page and its method](/lcnc-sdk-js/app/page/)

### Components

When `kf.context` is used in component event, refresh, show, hide methods from
component instance can be accessed.

Please refer more about [Components and its method](/lcnc-sdk-js/app/page/component)