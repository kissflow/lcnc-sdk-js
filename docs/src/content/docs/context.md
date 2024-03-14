---
title: Context
description: Context usage
---
The `kf.context` method lets you access specific method based on the where you're calling it.
Context methods are polymorphic, it has different classes pre-initialized based on execution context.

For example, if you're calling `kf.context` inside, you'll be able to access methods such as `getFields`, `updateFields`, `getTable`, etc.

Below are the places where you can use `kf.context`

- Forms
- Child Tables
- Pages
- Page components
- Custom components

### Example

Here's an example of using `kf.context` inside a form

```js
let requestNumber = kf.context.getField("Purchase_request_number")