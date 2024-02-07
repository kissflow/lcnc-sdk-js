---
title: to JSON
description: Retrieve data of current form as json
sidebar:
    order: 4
---

to retrieve data of current form as json

### Parameter

N/A

### Syntax

```js
kf.context.toJSON().then((formValues) => {...})
```

or

```js
let formValues = await kf.context.toJSON();
```

##### Returns an object