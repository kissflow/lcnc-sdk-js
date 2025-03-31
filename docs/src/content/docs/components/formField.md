---
title: Form field component
description: Installing and using custom form fields
sidebar:
  order: 2
---
Kissflow lets you build your own custom form fields as custom components to use across all forms in your app. A custom form field must be written using JavaScript and built using the React framework. Follow the installation and building instructions provided below.
## To create a custom form field project,

```base
npm create kf-component
```

- Enter project's name.

- Choose `form field`.
- npm install
- npm run dev

The custom component development package will contain the following files:
1. FormField.jsx
2. ReadonlyTable.jsx
3. EditableTable.jsx
4. Card.jsx for the web layout
And for the mobile/PWA layout, FormField.jsx and ReadonlyTable.jsx files.
Among these, it is mandatory that you write code for the **FormField.jsx** file. You can choose to skip coding for the other views. However, [this will affect](https://community.kissflow.com/t/35yfjp0/custom-form-field-components#what-happens-if-the-custom-form-field-does-not-have-ui-configuration) how your form field appears in the UI.

Once development is done, you can use the **`npm run build`** command to build and compress the project into a zip file. You can then import this zip file directly into Kissflow as a custom component.

> > This package is exclusively designed for the client side of your projects. Therefore, we only support ECMAScript modules (es modules) and Universal Module Definition (UMD) formats of JavaScript.


## Building a custom form field

To allow your custom form field to take on the properties you set in the Kissflow form UI, define the following properties in the form field’s code. 

The properties of the argument contains information about the form field, its current value and a method to update the current value of the field.

## Value

The property **Value** is the current value of the field.

### Example:

The example demonstrates how the field's current value is displayed within a native HTML input text box. When a new value is entered, the field updates accordingly, and the change is communicated to the Kissflow form using the `updateValue` method.

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

### updateValue
This function updates the current [value](/docs/src/content/docs/components/formField.md#value) of the custom form field.

### Parameter

| Parameter | Type   | Description             |
| ---------- | ------ | ----------------------- |
| newValue    | String, number, boolean, object, array of string, array of objects | The value that you intend to set for the custom form field. |


#### Example

```js
const { value } = props;
onClick = () => {
  updateValue(value + 1);
};
```

In the above example, if the field’s type is number, its value would increment by 1.

## Field properties
   The **Field** object takes on the properties you configure for your custom field in the form settings in the Kissflow UI. These properties include the field name, ID, type. Setting these properties will allow your custom field to behave like the default form fields.
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
}
````
### Definitions
1. id: Refers to the Field ID. This is a unique identifier for the form field.
2. name: Refers to the name of the field.
3. type: Refers to the data type of the field such as Text, Number, Boolean, Object, Array of objects, Array of strings.
4. isRequired: Indicates whether this field is a required field.
5. hint: Refers to the help text field.

### Readonly
The custom field will be locked and be uneditable if this property is marked as true.
readonly: true,

### Errors
You can set error messages to display when certain validation such as the isRequired parameter has failed. The value passed here must be an array of strings.
errors: ["Value is required"]

### Parameters

This property lists all the [input parameters](https://community.kissflow.com/t/35yfjp0/custom-form-field-components#creating-input-parameters) that you configured while creating a custom form field component in the Kissflow UI.

There are three types of input parameters that can be created:
String.
Number.
A static dropdown.

````json
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

#### Syntax

```json
{
  "cell": {
    "focused": true // | false,
  }
}
```

> Note:
This property is only applicable for **Sheet view**.

