# _Kissflow LCNC JavaScript SDK_
JavaScript SDK for developing over the Kissflow LCNC platform

### Use as an `npm` module
Install the SDK as a module:
`npm i @kissflow/lcnc-sdk-js`
Then import into your project:
```js
import LCNC from "@kissflow/lcnc-sdk-js";
const lcnc = LCNC();
```

### Use as a `<script>` tag directly in HTML
SDK can also be loaded directly into HTML by adding:
```html
<script type="module" async src="https://cdn.jsdelivr.net/npm/@kissflow/lcnc-sdk-js@1/dist/lcnc.sdk.min.js"></script>
```
Note specifying script type as "module" is must.
Then SDK can be initialized anywhere by declaring:

```js
const lcnc = window.LCNC()
```

### 1) Form Functions
> Note: These function can be used only on button and other events inside the kissflow forms
> Use Table:: as a prefix while using TableId
##### Get from field
```js
lcnc.currentForm.getField(fieldId).then((res) => {...})
// or  
let value = await lcnc.currentForm.getField(fieldId)
```
##### Update form field
```js
lcnc.currentForm.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue })
```
#### Update tableField
Appends row details to the end of table.
```js
lcnc.currentForm.addTableRow("tableId", { "columnId1": value, "columnId2": value })
```
------------------------------
### 2) Client Functions
##### Show Toast
```js
lcnc.client.showInfo(message)
```
##### Show confirm
```js
lcnc.client.showConfirm({title, content})
```
##### Redirect to URL
```js
lcnc.client.redirect(url)
```
##### Open a page in lowcode application
Note: Page Input parameters are optional..
```js
let pageInputParameters = {
  param1: value,
  param2: value
}
lcnc.client.openPage(pageId, pageInputParameters)
```
------------------------------
### 3) Component Functions
#### Refresh a component
```js
lcnc.getComponent(componentId).refresh()
```
--------------------------------

### 4) Lowcode application functions
Application variables has global context to application, 
##### Get value to application variable
```js
lcnc.app.getVariable("variableId");
```
##### Set value of application variable
```js
let value = await lcnc.app.setVariable("variableId", value);
// or
await lcnc.app.setVariable({
    variableId_1: "value_1",
    variableId_2: 3345
})
```
##### Get values of page input parameters
```js
let value = await lcnc.app.page.getParameter();
```
##### Open a popup page 
```js
let popupPage = await lcnc.app.page.openPopup(pageId, { inputParam1: 2 }, { w: 50; h: 50 }) 
```
Note: openPopup method returns the popup page class using which we can chain other functions in page, for eg: (cont. from above code snippet)
```js
popupPage.getVariable("variableName")
popupPage.onClose(() => {});
```
##### Page onClose event
```js
lcnc.app.page.onClose(() => {})
```
<!-- or -->
```js
let popupPage = await lcnc.app.page.openPopup(pageId, { inputParam1: 2 }, { w: 50; h: 50 }) 
popupPage.onClose(() => {});
```
------------------------------

### 6) Get account context
Give the current account information of the authenicated user.
```js
lcnc.getAccountContext().then((res) => {...})
// or
let resp = await lcnc.getAccountContext()
```
------------------------------

### 7) Fetch Api through lcnc sdk
Fetch any external api & other kissflow api using this method.
> Note: This method has a limit of 10 seconds for an api call
```js
lcnc.api(url, config).then((res) => {...})
// or
let resp = await lcnc.api(url, config)
```
------------------------------

### 8) Watch params
Listens for changes in parameter given to custom components in lowcode application.
```js
lcnc.watchParams(function(data) {
  console.log(data);
});
```
------------------------------

### 9) Formatter Functions
##### Format to KF Date
```js
lcnc.formatter.toKfDate("08-24-2021").then((res) => {...})
// or  
let value = await lcnc.formatter.toKfDate("08-24-2021");
```
##### Format to KF Date Time
```js
lcnc.formatter.toKfDateTime("2021-08-26T14:30").then((res) => {...})
// or  
let value = await lcnc.formatter.toKfDateTime("2021-08-26T14:30");
```
##### Format to KF Number
```js
lcnc.formatter.toKfNumber("1,00,000.500000").then((res) => {...})
// or  
let value = await lcnc.formatter.toKfNumber("1,00,000.500000");
```
##### Format to KF Currency
```js
lcnc.formatter.toKfCurrency("1,00,000.500000", "USD").then((res) => {...})
// or  
let value = await lcnc.formatter.toKfCurrency("1,00,000.500000", "USD");
```
##### Format to KF Boolean
```js
lcnc.formatter.toBoolean("yes").then((res) => {...})
// or  
let value = await lcnc.formatter.toBoolean("yes");
```
##### Other supported Boolean values
```js
let value = await lcnc.formatter.toBoolean("1");
let value = await lcnc.formatter.toBoolean("true");
let value = await lcnc.formatter.toBoolean("no");
let value = await lcnc.formatter.toBoolean("0");
let value = await lcnc.formatter.toBoolean("false");
```
------------------------------
