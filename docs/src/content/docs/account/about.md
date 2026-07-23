---
title: About
description: Account, user, and environment details
sidebar:
  order: 0
---

When integrating with the SDK, you often need details about the current account, the signed-in user, and the environment the custom UI is running in. These are exposed as ready-to-read properties on the `kf` object — no method call required:

- [`kf.account`](/account/account/) — the current account
- [`kf.user`](/account/user/) — the authenticated user (and their [assigned app roles](/account/roledetails/))
- [`kf.env`](/account/environment/) — the runtime environment
