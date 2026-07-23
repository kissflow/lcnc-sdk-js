---
title: Parse attachment
description: Trigger AI document parsing on a Smart Attachment field
sidebar:
  order: 77
---

Triggers AI document parsing on an uploaded file for a Smart Attachment field. Matching empty fields are auto-filled directly into the form store (respecting field permissions) — call `form.toJSON()` afterward to read the updated values.

### Parameters

| Parameters         | Type   | Description                                    |
| ------------------- | ------ | -------------------------------------------------|
| instanceId          | String | Required.                                         |
| activityInstanceId  | String | Required.                                         |
| fieldId             | String | Required. Id of the Smart Attachment field.       |
| file                | Object | Required. An uploaded file's metadata.            |

### Syntax

```js
const form = await processInstance.initForm();
const files = await kf.client.openFilePicker({ fileExtensions: ["pdf"], maxCount: 1 });
await form.updateField({ [fieldId]: files });
await processInstance.parseAttachment({
    instanceId: form.instanceId,
    activityInstanceId: form.activityInstanceId,
    fieldId,
    file: files[0]
});
const updated = await form.toJSON(); // other fields now auto-filled
```

### Returns

Returns `{ appliedFields, suggestedBy }`.
