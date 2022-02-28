# _Kissflow Lowcode JavaScript SDK_

JavaScript SDK for developing over the Kissflow lowcode platform

### Use as an `npm` module

Install the SDK as a module: `npm i @kissflow/lowcode-client-sdk` Then import into your project:

```js
import KFLowcodeSDK from "@kissflow/lowcode-client-sdk";
const kf = KFLowcodeSDK();
```

### Use as a `<script>` tag directly in HTML

SDK can also be loaded directly into HTML by adding:

```html
<script src="https://cdn.jsdelivr.net/npm/@kissflow/lowcode-client-sdk@1/dist/kflowcode.sdk.js"></script>
<!-- or -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@kissflow/lowcode-client-sdk@1/dist/kflowcode.sdk.module.js"></script>
```

> Then SDK can be initialized anywhere by declaring:
```js
const kf = window.KF();
```

### 1) Form Functions

### Main form functions
> Note: kf.currentForm cannot be used to access child tables
##### Get from field
```js
kf.currentForm.getField(fieldId).then((res) => {...})
// or
let value = await kf.currentForm.getField(fieldId)
```
##### Update form field
```js
kf.currentForm.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue });
```
##### Get JSON output of current form
```js
const json = await kf.currentForm.toJSON();
```
---
### Table functions
#### Add table row
Appends row details to the end of table.
```js
kf.currentForm.getTable(tableId).addRow({ columnId1: value, columnId2: value });
```
#### Delete table row
Deletes a row from the table based on the row id
```js
kf.currentForm.getTable(tableId).deleteRow(rowId);
```
#### Get table row
Gets a row from the table based on the row id
```js
const row = kf.currentForm.getTable(tableId).getRow(rowId);
```
#### Get all rows in a table
Gets all the rows of the table
```js
const rows = await kf.currentForm.getTable(tableId).getRows();
```
##### Get JSON output of child table
```js
const json = await kf.currentForm.getTable(tableId).toJSON();
```
---
### Table Form functions
> Note: kf.currentForm here refers to the current row of the child table.
 
##### Get from field
```js
kf.currentForm.getField(fieldId).then((res) => {...})
// or
let value = await kf.currentForm.getField(fieldId)
```
##### Update form field
```js
kf.currentForm.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue });
```
##### Get parent form functions
Gets the parent form reference to help us access all the main form functions
```js
kf.currentForm.getParent().updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue });
```
##### Get JSON output of child table's row
```js
const json = await kf.currentForm.toJSON();
```
---
### 2) Client Functions
##### Show Toast
```js
kf.client.showInfo(message);
```
##### Show confirm
```js
kf.client.showConfirm({ title, content });
```
##### Redirect to URL
```js
kf.client.redirect(url);
```
---
### 3) Component Functions
#### Refresh a component
```js
kf.getComponent(componentId).refresh();
```
#### Show a component
```js
kf.getComponent(componentId).show();
```
#### Hide a component
```js
kf.getComponent(componentId).hide();
```
---

### 4) Lowcode application functions
Application variables has global context to application,
##### Get value to application variable
```
let value = await kf.app.getVariable("variableId");
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
> Note: Page Input parameters are optional.
```js
let pageInputParameters = {
	param1: value,
	param2: value
};
kf.app.openPage(pageId, pageInputParameters);
```
##### Get values of page input parameters
```js
let value = await kf.app.page.getParameter();
```
##### Open a popup page
```js
let popupPage = await kf.app.page.openPopup(pageId, { inputParam1: 2 }, { w: 50; h: 50 })
```
> Note: openPopup method returns the popup page class using which we can chain other functions in page, for eg: (cont. from above code snippet)
```js
let variableName = await popupPage.getVariable("variableName");
popupPage.onClose(() => {});
```
##### Page onClose event
```js
kf.app.page.onClose(() => {});
// or
let popupPage = await kf.app.page.openPopup(pageId, { inputParam1: 2 }, { w: 50; h: 50 })
popupPage.onClose(() => {
  console.log("popup onclose");
  // ...
});
```
---

### 6) Get context
Returns the current account, user, page, and application.
```js
kf.getContext().then((ctx) => {...})
// or
let ctx = await kf.getContext()
/*
returns the context object like. 
ctx = {
  app: {_id },
  page: { _id },
  user: { Name, Email, UserType, _id },
  account: { _id }
}
*/
```
---

### 7) Fetch Api through kf sdk

Fetch any external api & other kissflow api using this method.
> Note: This method has a limit of 10 seconds for an api call
```js
kf.api(url, config).then((res) => {...})
// or
let resp = await kf.api(url, config)
```
---

### 8) Watch params
Listens for changes in parameter given to custom components in lowcode
application.
```js
kf.watchParams(function (data) {
	console.log(data);
});
```
---

### 9) Formatter Functions
##### Format to KF Date
```js
kf.formatter.toKfDate("08-24-2021").then((res) => {...})
// or
let value = await kf.formatter.toKfDate("08-24-2021");
```
##### Format to KF Date Time
```js
kf.formatter.toKfDateTime("2021-08-26T14:30").then((res) => {...})
// or
let value = await kf.formatter.toKfDateTime("2021-08-26T14:30");
```
##### Format to KF Number
```js
kf.formatter.toKfNumber("1,00,000.500000").then((res) => {...})
// or
let value = await kf.formatter.toKfNumber("1,00,000.500000");
```
##### Format to KF Currency
```js
kf.formatter.toKfCurrency("1,00,000.500000", "USD").then((res) => {...})
// or
let value = await kf.formatter.toKfCurrency("1,00,000.500000", "USD");
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
---
