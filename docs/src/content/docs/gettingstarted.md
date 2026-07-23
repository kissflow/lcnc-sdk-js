---
title: Getting started with Kissflow SDK
description: Interact with Kissflow from your scripts and custom UI using the JavaScript SDK.
---

The Kissflow SDK is a JavaScript library that lets you interact with Kissflow — read and update form fields, work with boards, dataforms, and processes, call internal APIs, format values, and drive the client (dialogs, files, navigation, and more).

You use the SDK in two ways.

## 1. In Kissflow's event editor (low-code / no-code)

When you write scripts inside Kissflow — form and field events, page `onLoad`/`unLoad` events, component events, or the **Run Script** connector — the `kf` object is already available as a **global**. There's nothing to install or initialize; just use it.

In these contexts, [`kf.context`](/context/) resolves to whatever entity you're scripting against — a Form, a child-table Row, a Page, or a Component:

```js
// Inside a form event, kf.context is the Form instance
let requestNumber = await kf.context.getField("Purchase_request_number");
```

The Run Script connector additionally exposes `kf.api()` for server-side API calls and `kf.formatter` for data formatting — see [Integration](/integration/).

## 2. In a custom App or Component

When you build your own custom UI, you install the SDK (or scaffold a project that already includes it) and initialize it yourself to get the `kf` instance:

- **Custom App** — a standalone custom UI that runs as its own app. See [Custom App](/build/custom-app/).
- **Custom Component** — reusable Page, Form, and Form field components embedded in Kissflow pages and forms. See [Custom Component](/build/custom-component/about/).

Projects scaffolded with `@kissflow/create-app` or `@kissflow/create-component` come with the SDK already installed and initialized — head to [Build](/build/custom-app/) to scaffold one.

### Installing the SDK manually

If you're adding the SDK to an existing project rather than scaffolding a new one, install it as an npm module:

```bash
npm install @kissflow/lowcode-client-sdk
```

> Prerequisite: Node.js 18.14.1 or above.

Initialize the SDK once at the entry point of your project, then reuse the same `kf` instance everywhere:

```js
import KFSDK from "@kissflow/lowcode-client-sdk";

let kf;
(async function () {
  kf = await KFSDK.initialize();
})();
```

For a plain HTML/JS project, import the UMD build instead:

```html
<script src="https://unpkg.com/@kissflow/lowcode-client-sdk@latest/dist/kfsdk.umd.js"></script>
```

```js
let kf;
window.onload = async function () {
  kf = await window.kf.initialize();
};
```

:::note[Note]
Initialization applies only to custom Apps and Components. In the event editor the `kf` global is already initialized for you. Initialize once at the root/entry of your project and share the same instance across your codebase.
:::

## What's next

However you reach it, the `kf` instance exposes the SDK surface:

- [Context](/context/) — the polymorphic `kf.context` for the entity your event runs on.
- [Account & User](/account/about/) — current account, user, roles, and environment.
- [Client](/client/about/) — dialogs, navigation, files, and device capture.
- [Form](/form/about/) — read and update form fields and child tables.
- [Application](/app/) — boards, dataforms, processes, pages, and variables.
- [API](/api/) — call Kissflow's internal REST APIs from your UI.
- [Formatter](/formatter/) — format values to Kissflow's data types.
