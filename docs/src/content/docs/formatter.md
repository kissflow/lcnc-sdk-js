---
title: Formatter
description: Formatter usages
---

Transform you data to Kissflow's data formats using following methods. 

### Date

```js
kf.formatter.toDate("08-24-2021").then((res) => {...})
// or
let value = await kf.formatter.toDate("08-24-2021");
```

### Date Time

```js
kf.formatter.toDateTime("2021-08-26T14:30").then((res) => {...})
// or
let value = await kf.formatter.toDateTime("2021-08-26T14:30");
```

### Number

```js
kf.formatter.toNumber("1,00,000.500000").then((res) => {...})
// or
let value = await kf.formatter.toNumber("1,00,000.500000");
```

### Currency

```js
kf.formatter.toCurrency("1,00,000.500000", "USD").then((res) => {...})
// or
let value = await kf.formatter.toCurrency("1,00,000.500000", "USD");
```

### Boolean

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
