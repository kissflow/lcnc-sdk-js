---
title: Formatter
description: Formatter usages
---

# _Kissflow Low-code JavaScript SDK_

Kissflow lets you extend your integrations and run server side functions using the **Run Script** connector. You can use the Kissflow SDK inside the connector to get application and account details and make API calls.

### 1. Get context

This function retrieves your account and application's context information, such
as the **account ID** and **application ID**.

```js
kf.getContext().then((ctx) => {...})
// or
let ctx = kf.getContext()
/*
fetches contextual information, such as:
ctx = {
  app: {_id },
  account: { _id }
}
*/
```

---

### 2. Get API via Kissflow Low-code SDK

This function lets you retrieve any external or Kissflow APIs. To access an
internal Kissflow API, use an absolute URL, **(i.e.,
https://{your_sub_domain}.kissflow.com/user/2/{account_id})**. The Access key
secret must be passed in the header. Refer
**[Access keys](https://helpdocs.kissflow.com/user-settings/api-keys#access_keys)**
to know how to locate your Kissflow API key and secret. Refer the developer
guide to know more about our **[APIs](https://api.kissflow.com)**.

> Note: The API call timeout for this method is 10 seconds.

```js
kf.api(url, config).then((res) => {...})
// or
let resp = await kf.api(url, config)
```

---

### 3) Formatter functions

##### Convert to Kissflow date format

This function lets you transform your date into Kissflow's date format. This
conversion is based on the date format specified in your Kissflow account format
settings.

```js
kf.formatter.toDate("08-24-2021").then((res) => {...})
// or
let value = kf.formatter.toDate("08-24-2021");
```

##### Convert to Kissflow DateTime format

This function lets you transform your date and time into Kissflow's DateTime
format. This conversion is based on the time zone and date format specified in
your Kissflow account format settings.

```js
kf.formatter.toDateTime("2021-08-26T14:30").then((res) => {...})
// or
let value = kf.formatter.toDateTime("2021-08-26T14:30");
```

##### Convert to Kissflow number format

This function lets you transform your number into Kissflow's number format.

```js
kf.formatter.toNumber("1,00,000.500000").then((res) => {...})
// or
let value = kf.formatter.toNumber("1,00,000.500000");
```

##### Convert to Kissflow currency format

This function lets you transform your current values into Kissflow's currency
format.

```js
kf.formatter.toCurrency("1,00,000.500000", "USD").then((res) => {...})
// or
let value = kf.formatter.toCurrency("1,00,000.500000", "USD");
```

##### Convert to boolean

This function converts your value to a boolean value.

```js
kf.formatter.toBoolean("yes").then((res) => {...})
// or
let value = kf.formatter.toBoolean("yes");
```

##### Other supported boolean values

```js
let value = kf.formatter.toBoolean("1");
let value = kf.formatter.toBoolean("true");
let value = kf.formatter.toBoolean("no");
let value = kf.formatter.toBoolean("0");
let value = kf.formatter.toBoolean("false");
```

---
