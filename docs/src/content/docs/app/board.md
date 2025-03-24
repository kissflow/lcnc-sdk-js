---
title: Board
description: Usage of board methods
---

With Kissflow Board, you can create highly adaptable workflows that let you keep track of information and manage work efficiently.

Get board instance using `getBoard` method from app's interface.

##### Parameters

| Parameters | Type   |
| ---------- | ------ |
| caseId     | String |

##### Syntax

```js
const boardInstance = kf.app.getBoard("case_id");
```

### Import CSV

Launches the import CSV modal, where you can upload a CSV file and map its
columns to the corresponding fields.

##### Parameters

| Parameters    | Type   | Description                                                              |
| ------------- | ------ | ------------------------------------------------------------------------ |
| defaultValues | Object | An object with keys as field Id and its values in respective data types. |

##### Syntax

```js
let defaultValues = { fieldId: "value" };
boardInstance.importCSV(defaultValues);
```

###### Example scenario

Consider a scenario where certain fields are not visible to the user (hidden in
form visibility). In that case, default values can be used to populate data in
these hidden fields.

```js
// Get the board with the board's flow_id
const boardInstance = kf.app.getBoard("Asset_Tracking_A00"); // Asset_Tracking_A00 is the flow_id

// Set field values for specific fields of the board
let boardInstance = { location: "India" }; // Location is the the field_id of a field inside the board

// Pass the field config into the import sdk method
boardInstance.importCSV(defaultValues); // All records imported through this importer would have Location field set as India
```

> Note
>
> 1. Default values are optional.
> 2. Any variables or parameter can also be mapped in `defaultValues`.
> 3. If a default value is set by the developer, end users cannot override it.
> 4. The following field types cannot be set as default: Signature, Aggregation, Geolocation, Sequence number, Scanner, and any other field that are marked as a computed field.
