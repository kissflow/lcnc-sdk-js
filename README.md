# _Kissflow Lowcode JavaScript SDK_

JavaScript SDK for developing over the Kissflow lowcode platform

### Use as an `npm` module

Install the SDK as a module: `npm i @kissflow/lowcode-client-sdk` Then import
into your project:

```js
import KFSDK from "@kissflow/lowcode-client-sdk";
let kf;
(async function () {
	kf = await KFSDK.initialize();
})();
```

> Note: Initializing Kf SDK in custom components returns a promise.

### Use as a `<script>` tag directly in HTML

SDK can also be loaded directly into HTML by adding:

```html
<script src="https://unpkg.com/@kissflow/lowcode-client-sdk@latest/dist/kfsdk.umd.js"></script>
```

Then SDK can be initialized as:

```js
let kf;
window.onload = async function () {
	kf = await window.kf.initialize();
};
```

### User and Account details

Details of authenticated user can be accessed as following

```js
const { Name, Email, _id, AppRoles } = kf.user;
```

### Role details

-   Retrieve assigned App roles
This property lists all of the roles assigned to the current user in an app.

##### Syntax

```js
kf.user.AppRoles
```

##### Example

```js
console.log(kf.user.AppRoles)
```

##### returns
This property returns an array of roles assigned to the current user. Each role will have an ID and a name.

##### Example

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

##### Note 
Use this property to return the first role in the list of roles assigned to a user
console.log(kf.user.AppRoles[0])

##### Example
```js
  {
  "_id": "Ro9mhLyuEFn4",
  "Name": "Admin"
  }
```

And account id can be accessed as `kf.account._id`

### Fetch Api through sdk

Fetch any other kissflow api & external api using this method. kf.api has header
tokens by default for making authenticated kissflow api calls

> Note: This method has a limit of 10 seconds for an api call

```js
kf.api(url, config).then((res) => {...})
// or
let resp = await kf.api(url, config)
```

## Table of contents

-   [1. Context](#1-context)
    -   [Custom Components](#custom-component)
    -   [Form](#custom-component)
        -   [Form Table](#form-table)
        -   [Table Row](#table-row)
-   [2. Client](#2-client)
-   [3. Application](#3-application)
-   [4. Page](#4-page)
-   [5. Component](#5-component)
    -   [Standard Component methods](#standard-component-methods)
    -   [Component Specific methods](#component-specific-methods)
        -   [Tab](#521-tab-component)
-   [6. Popup](#6-popup)
-   [7. Formatter](#7-formatter)

## 1) Context

Context methods are polymorphic, it has different classes pre-initialized based
on execution context.

### Custom component

`kf.context` returns a `CustomComponent` class while using inside custom
component. Custom component supported methods:

##### a) Watch Params

Listens for changes in parameter given to custom components in lowcode
application.

```js
kf.context.watchParams(function (data) {
	console.log(data);
});
```

### Kissflow Forms

`kf.context` returns a `Form` class when it is used inside a kissflow's form
that could be either Process, case or Dataform & it has following supported
methods

##### a) getField()

###### Description:

Use this function to get the current value of a form field

###### Syntax:

```js
kf.context.getField(fieldId).then((res) => {...})
// or
let value = await kf.context.getField(fieldId)
```

##### b) updateField()

###### Description:

Use this function to get update any field in the form

###### Syntax:

```js
kf.context.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue });
```

##### c) toJSON()

###### Description:

Use this function to get the JSON data of the current form

###### Syntax:

```js
const json = await kf.context.toJSON();
```

###### Output:

```
{
    "Untitled_Field": "testing",
    "_created_at": "2022-03-01T03:04:09Z",
    "_flow_name": "form events",
    "_id": "Pk4_T1WGWuMe",
    "_modified_at": "2022-03-01T03:04:09Z"
}
```

### Form Table

`kf.context.getTable(tableId)` returns a `Table` class which has the following
methods

#### a) addRow()

###### Description:

Appends row details to the table.

###### Syntax:

```js
const table = kf.context.getTable(tableId);
table.addRow({ columnId1: value, columnId2: value });
```

> ##### Note: If there are more than one rows to be added to table then use `addRows()` instead for these bulk operations

#### b) addRows()

###### Description:

Appends multiple rows details to the table.

###### Syntax:

```js
const table = kf.context.getTable(tableId);
let accumulator = [];
someArrayOfObjects.forEach(function (rowDetail) {
	accumulator.push({
		columnId1: rowDetail[columnId1],
		columnId2: rowDetail[columnId2]
	});
});
await table.addRows(accumulator);
```

#### c) deleteRow()

###### Description:

Deletes a row from the table based on the row id

###### Syntax:

```js
const table = kf.context.getTable(tableId);
await table.deleteRow(rowId);
```

> ##### Note: If there are more than one rows to be deleted then use `deleteRows()` instead.

#### d) deleteRows()

###### Description:

Deletes multiple rows from the table based on given array of strings.

###### Syntax:

```js
const table = kf.context.getTable(tableId);
await table.deleteRows([rowId1, rowId2, rowId3]);
```

#### e) getRow()

###### Description:

Use this function to perform form actions on any row inside a child table

###### Syntax:

```js
const table = kf.context.getTable(tableId);
const row = table.getRow(rowId);
```

###### Output:

Returns an instance of `TableForm` class

#### f) getRows()

###### Description:

Gets all the rows of the table

###### Syntax:

```js
const rows = await kf.context.getTable(tableId).getRows();
```

###### Output:

Returns an array of `TableForm` instances

##### g) toJSON()

###### Description:

Use this function to get the JSON data of the child table

###### Syntax:

```js
const json = await kf.context.getTable(tableId).toJSON();
```

###### Output:

```
[{
    "Untitled_Field": "row 1",
    "_created_at": "2022-03-01T03:04:09Z",
    "_flow_name": "form events",
    "_id": "Pk4_T1WGWuMe",
    "_modified_at": "2022-03-01T03:04:09Z"
},{
    "Untitled_Field": "row 2",
    "_created_at": "2022-03-01T03:04:09Z",
    "_flow_name": "form events",
    "_id": "Pk4_T1WGWuMe",
    "_modified_at": "2022-03-01T03:04:09Z"
}]
```

##### h) getSelectedRows()

###### Description:

Use this function to get selected rows on the given `tableId`

###### Syntax:

```js
let table = await kf.context.getTable("tableId");
let selectedRows = await table.getSelectedRows();
```

###### Output:

```
[{
    "Untitled_Field": "row 1",
    "_created_at": "2022-03-01T03:04:09Z",
    "_flow_name": "form events",
    "_id": "Pk4_T1WGWuMe",
    "_modified_at": "2022-03-01T03:04:09Z"
},{
    "Untitled_Field": "row 2",
    "_created_at": "2022-03-01T03:04:09Z",
    "_flow_name": "form events",
    "_id": "Pk4_T1WGWuMe",
    "_modified_at": "2022-03-01T03:04:09Z"
}]
```

### Table Row

A single row inside a table is known as Table row `kf.context` returns a
`TableForm` class which has the following methods

##### a) getField()

###### Description:

Use this function to get the value of the table row

###### Syntax:

```js
kf.context.getField(fieldId).then((res) => {...})
// or
let value = await kf.context.getField(fieldId)
```

##### b) updateField()

###### Description:

Use this function to get update any field in the table row

###### Syntax:

```js
kf.context.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue });
```

##### c) getParent()

###### Description:

Use this function to perform form actions on the main form

###### Syntax:

```js
const mainForm = kf.context.getParent();
mainForm.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue });
```

###### Output:

Returns an instance of `Form` class using which we can perform any action on the
main form

##### d) toJson()

##### Description:

Get JSON output of table row

##### Syntax:

```js
const json = await kf.context.toJSON();
```

###### Output:

```
{
    "Untitled_Field": "testing",
    "_created_at": "2022-03-01T03:04:09Z",
    "_flow_name": "form events",
    "_id": "Pk4_T1WGWuMe",
    "_modified_at": "2022-03-01T03:04:09Z"
}
```

---

### 2) Client

##### Show Toast

```js
kf.client.showInfo(message);
```

##### Show confirm

Displays the confirmation dialog, and returns users's action as a response

```js
kf.client.showConfirm({ title, content }).then((action) => {
    if(action === "OK") // user clicked ok button

    else // user clicked cancel button or clicked outside the popup
})
```

##### Redirect to URL

```js
kf.client.redirect(url);
```

### 3) Application

`kf.app` represents the active kissflow app and `kf.app._id` returns its id.

##### Get value to application variable

```js
const appVarible1 = await kf.app.getVariable("variableId");
```

##### Set value of application variable

```js
let value = await kf.app.setVariable("variableId", value);
// or
await kf.app.setVariable({
	variableId_1: "value_1",
	variableId_2: 3345
});
```

##### Open a page

`openPage(id)` returns [Page](#4-page) class instance

```js
const pageInputParameters = {
	param1: value,
	param2: value
};
kf.app.openPage(pageId, pageInputParameters);
// Note: Page Input parameters are optional.
```

##### Get a dataform instance

`getDataform(formId)` returns a Dataform class instance

```js
const dfInstance = kf.app.getDataform("dataform_id");
```

### 4) Page

`kf.app.page` returns the active page opened inside application and
`kf.app.page._id` returns its id.

##### Page parameters

```js
let value = await kf.app.page.getParameter("parameterId"); // for retreiving single parameter
```

Get all page parameters

```js
let allParams = await kf.app.page.getAllParameters();
// returns an object
{
    parameterName: "Sample value",
    parameterName2: "Sample value 2"
}
```

##### Access a Component

`getComponent` returns a [Component](#5-component) class.

```js
const componentName = await kf.app.page.getComponent("componentId");
```

##### Open a popup

`openPoup` returns a [Popup](#6-popup) class.

```js
kf.app.page.openPopup("popupId", { inputParam1: "value" });
// Note: Popup parameters are optional.
```

### 5) Component

#### getComponent(id)

Parameter: Component's Id Returns: Component class instance

```js
const component = await kf.app.page.getComponent(componentId);
```

##### Standard Component Methods

```js
component.refresh(); // Refreshes the component
component.hide(); // Hides the component
component.show(); // Shows the component if it's been hidden previously
```

##### Component Specific Methods

##### 5.2.0) Component onMount

Component onMount takes in callBack function as argument.

> ##### Note: Any component specific methods that are used on Page load must be called inside component's onMount event.
>
> Parameter: function

```js
component.onMount(() => {
	// function logic goes here... For eg.
	// component.setActiveTab(2)
});
```

##### 5.2.1) Tab component

##### 1) setActiveTab

Sets specified tab as active. Parameter: Tabs' Number (Starts from 1 to N)

```js
component.setActiveTab(2); // sets 2nd tab as active one
```

### 6) Popup

`kf.app.page.popup` returns the active popup instance opened inside the page and
its id can be accessed via `kf.app.page.popup._id` And
`kf.app.page.getPopup(id)` returns this popup class instance.

##### Popup parameters

```js
let value = await kf.app.page.popup.getParameter("parameterId"); // for retreiving single popup parameter
```

Get all popup parameters

```js
let allParams = await kf.app.page.popup.getAllParameters();
// Returns an object
{
    parameterName: "Sample value",
    parameterName2: "Sample value 2"
}
```

##### Close popup

```js
kf.app.page.popup.close(); // for active popup
// or if you already have a popup instance...
greetPopup.close();
```

### 8) Dataform

In Kissflow apps, dataforms gather and store data, enabling users to submit data
into an app.

To begin with, obtain the dataform instance using:

```js
const dfInstance = kf.app.getDataform("dataform_id");
```

##### Import CSV

Launches the import CSV popup, where you can upload CSV file and map columns to
the corresponding fields.

```js
let defaultValues = { fieldId: "value" };
dfInstance.importCSV(defaultValues);
```

###### Example scenario

Consider scenario where certain fields are not visible to the user(hidden in
form visibilty). In that case, default values can be used to populate data in
these hidden fields

```js
//Get the dataform with the dataform's flow_id
const dfInstance = kf.app.getDataform("Product_Dataform_A00"); //Product_Dataform_A00 is the flow_id

//Set field values for specific fields of the dataform
let defaultValues = { location: "India" }; //Location is the the field_id of a field inside the dataform

//Pass the field config into the import sdk method
dfInstance.importCSV(defaultValues); //All records imported through this importer would have Location field set as India
```

> Note:
>
> 1. Default values are optional
> 2. Any variables or parameter can also be mapped in `defaultValues`.
> 3. If a default value is set by the developer, end users cannot override it.
> 4. Certain fields cannot be set as default, such as auto-calculated fields and
>    sequence numbers.

### 9) Board

Get board instance like

```js
const boardInstance = kf.app.getBoard("case_id");
```

##### Import CSV

Launches the import CSV modal, where you can upload a CSV file and map its
columns to the corresponding fields.

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

> Note:
>
> 1. Default values are optional
> 2. Any variables or parameter can also be mapped in `defaultValues`.
> 3. If a default value is set by the developer, end users cannot override it.
> 4. Certain fields cannot be set as default, such as auto-calculated fields and
>    sequence numbers.

### 7) Formatter

##### Format to KF Date

```js
kf.formatter.toDate("08-24-2021").then((res) => {...})
// or
let value = await kf.formatter.toDate("08-24-2021");
```

##### Format to KF Date Time

```js
kf.formatter.toDateTime("2021-08-26T14:30").then((res) => {...})
// or
let value = await kf.formatter.toDateTime("2021-08-26T14:30");
```

##### Format to KF Number

```js
kf.formatter.toNumber("1,00,000.500000").then((res) => {...})
// or
let value = await kf.formatter.toNumber("1,00,000.500000");
```

##### Format to KF Currency

```js
kf.formatter.toCurrency("1,00,000.500000", "USD").then((res) => {...})
// or
let value = await kf.formatter.toCurrency("1,00,000.500000", "USD");
```

##### Format to KF Boolean

```js
kf.formatter.toBoolean("yes").then((res) => {...})
// or
let value = await kf.formatter.toBoolean("yes");
```

##### Other supported Boolean values

```js
let value = await kf.formatter.toBoolean("1");
let value = await kf.formatter.toBoolean("true");
let value = await kf.formatter.toBoolean("no");
let value = await kf.formatter.toBoolean("0");
let value = await kf.formatter.toBoolean("false");
```
