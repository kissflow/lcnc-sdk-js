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
<script src="https://cdn.jsdelivr.net/npm/@kissflow/lcnc-sdk-js@1.0.5/src/index.min.js"></script>
```
Then SDK can be initialized anywhere by declaring:

```js
const lcnc = window.LCNC()
```

### 1) Form Functions
> Note: These function can be used only on button and other events inside the kissflow forms
#### 1.1) Get from field
```
lcnc.currentForm.getField(fieldId).then((res) => {...})
or  
let value = await lcnc.currentForm.getField(fieldId)
```
#### 1.2) Get table field
```
let tableInstance = lcnc.currentForm.getTable(tableId)
tableInstance.getField(rowIndex, fieldId).then((res) => console.log(res))
or  
let value = await tableInstance.getField(rowIndex, fieldId)
```
#### 1.3) Update form field
```
lcnc.currentForm.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue })
```
------------------------------
### 2) Client Functions
#### 2.1) Show Toast
```
lcnc.client.showInfo(message)
```
#### 2.2) Show confirm
```
lcnc.client.showConfirm({title, content})
```
------------------------------
### 3) Get account context

Give the current account information of the authenicated user.

```
lcnc.getAccountContext().then((res) => {...})
or
let resp = await lcnc.getAccountContext()
```
------------------------------

### 4) Fetch Api through lcnc sdk

Fetch any external api & other kissflow api using this method.

> Note: This method has a limit of 10 seconds for an api call

```
lcnc.api(url, config).then((res) => {...})
or
let resp = await lcnc.api(url, config)
```
------------------------------

### 5) Watch params

Listens for changes in parameter given to custom components.

```
lcnc.watchParams(function(data) {
  console.log(data);
});
```
------------------------------

### 6) Formatter Functions
#### 6.1) Format to KF Date
```
lcnc.formatter.toKfDate("08-24-2021").then((res) => {...})
or  
let value = await lcnc.formatter.toKfDate("08-24-2021");
```
#### 6.2) Format to KF Date Time
```
lcnc.formatter.toKfDateTime("2021-08-26T14:30").then((res) => {...})
or  
let value = await lcnc.formatter.toKfDateTime("2021-08-26T14:30");
```
#### 6.3) Format to KF Number
```
lcnc.formatter.toKfNumber("1,00,000.500000").then((res) => {...})
or  
let value = await lcnc.formatter.toKfNumber("1,00,000.500000");
```
#### 6.4) Format to KF Currency
```
lcnc.formatter.toKfCurrency("1,00,000.500000", "USD").then((res) => {...})
or  
let value = await lcnc.formatter.toKfCurrency("1,00,000.500000", "USD");
```
#### 6.5) Format to KF Boolean
```
lcnc.formatter..toBoolean("yes").then((res) => {...})
or  
let value = await lcnc.formatter.toBoolean("yes");
```
#### Other supported Boolean values
```
let value = await lcnc.formatter.toBoolean("1");
let value = await lcnc.formatter.toBoolean("true");
let value = await lcnc.formatter.toBoolean("no");
let value = await lcnc.formatter.toBoolean("0");
let value = await lcnc.formatter.toBoolean("false");
```
------------------------------
