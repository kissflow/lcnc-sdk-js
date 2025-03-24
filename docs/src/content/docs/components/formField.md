---
title: Form field
description: Installing and using custom page components
sidebar:
  order: 2
---

The properties of the argument contains information about the form field, its current value and a method to update the current value of the field.

## Value

The property Value is the current value of the field.

### Example:

The example will show the current value of the field inside a native HTML input text box, when the user types something the field’s value will update, the update is notified to kissflow forms using the updateValue method.

```js
import React from "react";

export function FormField(props) {
  const { value, actions } = props;
  const { updateValue } = actions;
  return (
    <input
      type="text"
      value={value}
      placeholder="User's name"
      onchange={(e) => updateValue(e.target.value)}
    />
  );
}
```

1. Actions
   Holds all the methods associated with performing an action, such as updating a field.

```js
const api = {
  actions: {
    updateValue,
  },
};
```

updateValue
This function updates the current value of the custom form field. // hyperlink value definition
Parameters

Parameter
Type
Description
newValue
String, number, boolean, object, array of string, array of objects
The value that you intend to set for the custom form field.

Example

```js
const { value } = props;
onClick = () => {
  updateValue(value + 1);
};
```

In the above example, if the field’s type is number, its value would increment by 1.

2. Field properties
   The Field object takes on the properties you configure for your custom field in the form settings in the Kissflow UI. These properties include the field name, ID, type. Setting these properties will allow your custom field to behave like the default form fields.
   Syntax

````json
 {
    "field": {
        "id": "untitled_field",
        "name": "Untitle field",
        "type": "Text",
        "isRequired": false,
        "hint": "Please fill me!"
    }
}```

id: Refers to the Field ID. This is a unique identifier for the form field.
name: Refers to the name of the field.
type: Refers to the data type of the field such as Text, Number, Boolean, Object, Array of Objects, Array of Strings.
isRequired: Indicates whether this field is a required field.
hint: Refers to the help text field.

## Readonly
The custom field will be locked and be uneditable if this property is marked as true.
readonly: true,

Errors
You can set error messages to display when certain validation such as the isRequired parameter has failed. The value passed here must be an array of strings.
errors: ["Value is required"]

Parameters

This property lists all the [input parameters] that you configured while creating a custom form field component in the Kissflow UI.

There are three types of input parameters that can be created:
String.
Number.
A static dropdown.

```json
{
"max_length": 100,
"gender": {
"Label 1": "Male",
"Label 2": "Female"
},
"username": "Name"
}
````

## Cell

This object displays the properties defined for a cell.

When the property ‘focused’ is true, the cell is highlighted with a blue outline, indicating that it is ready to take a field value as the user's input. When it is false, the cell will be in a display-only mode.

Syntax

```json
{
  "cell": {
    "focused": true // | false,
  }
}
```

:::note[Note]
This property is only applicable for Sheet view.
:::
