---
title: Pick location
description: Open the platform's map picker
sidebar:
  order: 31
---

Opens the platform's native geolocation map picker (search, current-location detection, marker drag, reverse-geocoding) in a modal over the custom form/component. It runs in the parent window, which owns the Google Maps API key.

### Parameter

| Parameter | Type   | Description                                             |
| --------- | ------ | ------------------------------------------------------ |
| value     | Object | Optional current geolocation value to pre-select on the map. |

The `value` object accepts the following properties:

| Property                    | Type   | Description                          |
| --------------------------- | ------ | ------------------------------------ |
| Latitude                    | String | The latitude of the location.        |
| Longitude                   | String | The longitude of the location.       |
| Address                     | String | The formatted address (optional).    |
| City, State, Country, ZipCode, Area | String | Additional address parts (optional). |

### Syntax

```js
kf.client.pickLocation(value).then((location) => {...})
```

or

```js
const location = await kf.client.pickLocation(value);
```

### Returns

Returns a promise that resolves with the picked location object, or `null` if the picker is closed without a selection.

### Example

To let the client pick a location and pass it to the field's change handler.

```js
const location = await kf.client.pickLocation();
if (location) onChange(location);
```

#### Output

```js
{
  Address: "MG Road, Bengaluru, Karnataka 560001, India",
  Latitude: "12.9757",
  Longitude: "77.6060",
  City: "Bengaluru",
  State: "Karnataka",
  Country: "India",
  ZipCode: "560001"
}
```
