---
title: Decision table
description: Usage of Decision table
---

A decision table is a systematic and structured representation of complex
business logic or decision-making processes.

Get a decision table instance using `getDecisionTable` from app's interface.

##### Parameters

| Parameters      | type   |
| --------------- | ------ |
| decisionTableId | String |

##### Syntax

```js
let decisionTableInstance = kf.app.getDecisionTable(decisionTableId);
```

### Evaluate

From the instance you can able to evaluate the decision table using `evaluate`
method.

##### Parameters

| Parameters | type   | Description                                                         |
| ---------- | ------ | ------------------------------------------------------------------- |
| payload    | Object | An object with keys as condition field id and its respective values |

##### Syntax

```js
let payload = { conditionField1: "value", conditionField2: "value" };
await decisionTableInstance.evaluate(payload);
```

##### Return

Returns a decision table output

##### Example

To evaluate if a loan request can be approved or not using a decision table (ID:
Loan_decision_table), specify the relevant condition IDs (conditionField1,
conditionField2, etc.) along with their corresponding input values
(Age_conditionID, 18).

```js
let decisionTableInstance = kf.app.getDecisionTable("Loan_decision_table");
let decisionOutput = await decisionTableInstance.evaluate({
	Age_conditionID: 18
});
```
