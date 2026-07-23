---
title: About
description: Retrieve value of form field
sidebar:
  order: 0
---

A form is an entity that you can use to collect input from the people who participate in your workflows. Forms are predominantly used in flows like processes, boards, and dataforms in Kissflow. A form has three primary components - section, field, and table.

SDKs for forms are available in both apps and in the individual flows in the Kissflow. The available methods are:

1. getField()
2. updateField()
3. getTable()
4. toJSON()

The following [Form state](/form/form-state/about/) methods are available only in custom components, on the Form instance returned by [`initForm()`](/app/board/initform/):

5. getValidationErrors()
6. getFormConfiguration()
7. getFieldState()

> Note: Form’s SDKs exclusively support read and update methods, with no provision for create and delete operations.

> Note: `kf.context` resolves to a Form instance inside form events. Outside of form events — for example, when building a custom UI for a board or dataform item — you can obtain a Form instance explicitly via [`board.initForm()`](/app/board/initform/) or [`dataform.initForm()`](/app/dataform/initform/).
