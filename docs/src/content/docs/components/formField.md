---
title: Form field component
description: Installing and using custom form fields
sidebar:
    order: 2
---

Kissflow lets you build your own custom form fields as custom components to use across all forms in your app. A custom form field must be written using JavaScript and built using the React framework. Follow the installation and building instructions provided below.

##### Prerequisites

-   Node.js
-   A version manager for Node.js

To create a custom form field project,

```bash
npx create-kf-component@latest
```

Enter the project's name and choose `form field`.

:::note[Note]
Node.js 16.x.x is the recommended version for this project.
:::

Change directory to your project and open it using your preferred code editor,

```bash
cd <your-project-name>
code . # To open the project using VS Code.
```

To install dependencies,

```bash
npm install
```

To run a dev build,

```bash
npm run dev
```

The project will contain the following files, `FormField.jsx`, `DataTable.jsx`, `Sheet.jsx`, and `Card.jsx` for the web layout.

And for the mobile/PWA layout, `FormField.jsx` and `DataTable.jsx` files.
Among these, it is mandatory that you write code for the web's `FormField.jsx` file. You can choose to skip coding for the other views. However, <a href="https://community.kissflow.com/t/35yfjp0/custom-form-field-components#what-happens-if-the-custom-form-field-does-not-have-ui-configuration" target="_blank" rel="noopener noreferrer">this will affect</a> how your form field appears in the UI.

Once development is done, you can use the `npm run zip` command to generate a .zip file of your form field. You can then import this .zip file directly into Kissflow as a custom form field.

## Building a custom form field

The properties of the field that you configured in the Kissflow form, the current value of the field and a function to update
the current value of the field will be given to your React component as props.

### Value

The property **Value** is the current value of the field.

#### Example:

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
            onChange={(e) => updateValue(e.target.value)}
        />
    );
}
```

### Actions

Holds all the methods associated with performing an action, such as updating a field.

```js
const api = {
    actions: {
        updateValue
    }
};
```

#### updateValue

This function updates the current [value](#value) of the custom form field.

##### Parameter

| Parameter | Type                                                               | Description                                                 |
| --------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| newValue  | String, number, boolean, object, array of string, array of objects | The value that you intend to set for the custom form field. |

###### Example

```js
const { value } = props;
onClick = () => {
    updateValue(value + 1);
};
```

In the above example, if the field’s type is number, its value would increment by 1.

### Field properties

The **Field** object takes on the properties you configure for your custom field in the form settings in the Kissflow UI. These properties include the field name, ID, type.
Setting these properties will allow your custom field to behave like the default form fields.

#### Sample

```json
{
    "field": {
        "id": "untitled_field",
        "name": "Custom email field",
        "type": "Text",
        "isRequired": false,
        "hint": "Enter a valid email (e.g., user@example.com)"
    }
}
```

#### Definitions

-   **id:** Refers to the Field ID. This is a unique identifier for the form field.
-   **name:** Refers to the name of the field.
-   **type:** Refers to the data type of the field such as Text, Number, Boolean, Object, Array of objects, Array of strings.
-   **isRequired:** Indicates whether this field is a required field.
-   **hint:** Refers to the help text of the field.

### Readonly

The custom field will be locked and be uneditable if this property is marked as true.

#### Sample

```json
{ "readonly": true }
```

### Errors

In the Kissflow form UI, you can define validation rules for your custom field or mark it as required. If a user’s input fails validation, the error messages you’ve configured will be passed to your React component as props, allowing you to display them in your UI.

#### Sample

```json
{
    "errors": ["Value is required", "Value must more than 50."]
}
```

### Parameters

This property lists all the <a href="https://community.kissflow.com/t/35yfjp0/custom-form-field-components#creating-input-parameters" target="_blank">input parameters</a> that you configured
while creating a custom form field component in the Kissflow UI.

There are three types of input parameters that can be created:

-   String.
-   Number.
-   A static dropdown.

#### Sample

```json
{
    "max_length": 100,
    "gender": {
        "Label 1": "Male",
        "Label 2": "Female"
    },
    "username": "Name"
}
```

### Cell

This object represents the properties of a cell in Sheet view.

### Focused

When the property `focused` is true, the cell is highlighted with a blue outline, indicating that it is ready to take a field value as
the user's input. When it is false, the cell will be in a display-only mode.

#### Sample

```json
{
    "cell": {
        "focused": true
    }
}
```

:::note[Note]
This property is only applicable for **Sheet view**.
:::
