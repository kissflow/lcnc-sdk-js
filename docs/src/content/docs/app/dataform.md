---
title: Dataform
description: Usage of dataform methods
---

Get dataform instance using `getDataform` method from app's interface.

##### Parameters

| Parameters | type   |
| ---------- | ------ |
| dataformId | String |

##### Syntax

```js
let dataformInstance = kf.app.getDataform(dataformId);
```

### Import CSV

This method lets you to trigger the import CSV modal where user could upload CSV
file and map respective columns to the field.

##### Parameters

| Parameters    | type   | Description                                                          |
| ------------- | ------ | -------------------------------------------------------------------- |
| defaultValues | Object | Object with keys as field Id and its values in respective data types |

##### Syntax

```js
let defaultValues = { fieldId: "value" };
dataformInstance.importCSV(defaultValues);
```

##### Example

Consider scenario where few fields that aren't exposed to user(basically hidden
in form visibilty). In such cases Default values can be used to provide data to
hidden fields

```js
// Here the location field is hidden to user,
// thus user isn't aware to include this on import csv.
let defaultValues = { location: "India" };
dataformInstance.importCSV(defaultValues);
```

> Note:
>
> 1. Default values here is optional
> 2. Any variables or parameter can also be mapped in `defaultValues`.
> 3. End user can't pass this value if default value is set by dev.
> 4. Some fields cannot be set as default eg. Auto calculated fields, Sequence
>    numbers etc.
