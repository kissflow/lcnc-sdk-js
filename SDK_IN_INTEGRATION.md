# _Kissflow Lowcode JavaScript SDK in integration_

Kissflow Lowcode JavaScript SDK's supported functions in integration

### 1) Get context
Returns the current account and application.
```js
kf.getContext().then((ctx) => {...})
// or
let ctx = await kf.getContext()
/*
returns the context object like. 
ctx = {
  app: {_id },
  account: { _id }
}
*/
```
---

### 2) Fetch Api through kf sdk

Fetch any external api & other kissflow api using this method. For accessing internal kissflow APIs,the url should be absolute(e.g. https://{your_sub_domain}.kissflow.com/user/2/{account_id}) and the access key secrets must have passed in headers. Refer [API keys](https://helpdocs.kissflow.com/user-settings/api-keys) to get kissflow api key secrets and [this](https://developers.kissflow.com) for more information.
> Note: This method has a limit of 10 seconds for an api call
```js
kf.api(url, config).then((res) => {...})
// or
let resp = await kf.api(url, config)
```
---

### 3) Formatter Functions
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
---
