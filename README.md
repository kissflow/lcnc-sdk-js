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
const lcnc = window.LCNC
```

### 1) Form Functions
> Note: These function can be used only on button and other events inside the kissflow forms
> Use Table:: as a prefix while using TableId
##### Get from field
```
lcnc.currentForm.getField(fieldId).then((res) => {...})
or  
let value = await lcnc.currentForm.getField(fieldId)
```
##### Update form field
```
lcnc.currentForm.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue })
```
------------------------------
### 2) Client Functions
##### Show Toast
```
lcnc.client.showInfo(message)
```
##### Show confirm
```
lcnc.client.showConfirm({title, content})
```
##### Redirect to URL
```
lcnc.client.redirect(url)
```
##### Open a page in lowcode application
Note: Page Input parameters are optional..
```
let pageInputParameters = {
  param1: value,
  param2: value
}
lcnc.client.openPage(pageId, pageInputParameters)
```
------------------------------

### 3) Lowcode application functions
Application variables has global context to application, 
##### Get value to application variable
```
lcnc.app.getVariable("variableId");
```
##### set value of application variable
```
let value = await lcnc.app.setVariable("variableId", value);
or
await lcnc.app.setVariable({
    variableId_1: "value_1",
    variableId_2: 3345
})
```
------------------------------
### 4) Lowcode page builder functions
##### Get values of page input parameters
```
let value = await lcnc.page.getParameter();
```
------------------------------

### 5) Get account context
Give the current account information of the authenicated user.
```
lcnc.getAccountContext().then((res) => {...})
or
let resp = await lcnc.getAccountContext()
```
------------------------------

### 6) Fetch Api through lcnc sdk
Fetch any external api & other kissflow api using this method.
> Note: This method has a limit of 10 seconds for an api call
```
lcnc.api(url, config).then((res) => {...})
or
let resp = await lcnc.api(url, config)
```
------------------------------

### 7) Watch params
Listens for changes in parameter given to custom components in lowcode application.
```
lcnc.watchParams(function(data) {
  console.log(data);
});
```
------------------------------

### 8) Formatter Functions
##### Format to KF Date
```
lcnc.formatter.toKfDate("08-24-2021").then((res) => {...})
or  
let value = await lcnc.formatter.toKfDate("08-24-2021");
```
##### Format to KF Date Time
```
lcnc.formatter.toKfDateTime("2021-08-26T14:30").then((res) => {...})
or  
let value = await lcnc.formatter.toKfDateTime("2021-08-26T14:30");
```
##### Format to KF Number
```
lcnc.formatter.toKfNumber("1,00,000.500000").then((res) => {...})
or  
let value = await lcnc.formatter.toKfNumber("1,00,000.500000");
```
##### Format to KF Currency
```
lcnc.formatter.toKfCurrency("1,00,000.500000", "USD").then((res) => {...})
or  
let value = await lcnc.formatter.toKfCurrency("1,00,000.500000", "USD");
```
##### Format to KF Boolean
```
lcnc.formatter.toBoolean("yes").then((res) => {...})
or  
let value = await lcnc.formatter.toBoolean("yes");
```
##### Other supported Boolean values
```
let value = await lcnc.formatter.toBoolean("1");
let value = await lcnc.formatter.toBoolean("true");
let value = await lcnc.formatter.toBoolean("no");
let value = await lcnc.formatter.toBoolean("0");
let value = await lcnc.formatter.toBoolean("false");
```
------------------------------
