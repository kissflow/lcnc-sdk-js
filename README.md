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
lcnc.form.getField(fieldId).then((res) => {...})
or  
let value = await lcnc.form.getField(fieldId)
```
#### 1.2) Get table field
```
lcnc.form.getTableField(tableId, rowIndex, fieldId).then((res) => {...})
or  
let value = await lcnc.form.getTableField(tableId, rowIndex, fieldId)
```
#### 1.3) Update form field
```
lcnc.form.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue })
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

Fetches any external api & other kissflow api using this method.

> Note: This method has a limit of 10 seconds for an api call

```
lcnc.api(url, config).then((res) => {...})
or
let resp = await lcnc.api(url, config)
```