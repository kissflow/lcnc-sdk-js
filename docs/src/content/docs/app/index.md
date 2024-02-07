---
title: About
description: Explanation about app context
sidebar:
    order: 1
---

`kf.app` represents the active kissflow.

Application Id can be retreived like `kf.app._id`.

`kf.app` and other subsequent method signatures are accessible on:
  - Form, only if its rendered inside an application.
  - Custom components.
  - Across all widget/popup events inside the page and page events.
  - Bulk/Custom actions in dataforms inside application