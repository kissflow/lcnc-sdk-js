---
title: toJson
description: Retrieve data of current form as json
sidebar:
    order: 3
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