---
title: Report
description: Read a flow report's calculated data
---

A report is a saved view of a flow's data, worked out by Kissflow: a chart's groups and values, or a
card's single number. Reading a report takes one call, instead of reading every record and adding it up
on the page.

Reports belong to a Form (DataForm), Process, Case or Board flow. Datasets and lists have no reports.

Get a report instance using `getReport` from app's interface. No request is sent until you call one of
its methods.

##### Parameters

| Parameter | type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| flowType  | String | `"Form"`, `"Process"`, `"Case"` or `"Board"`    |
| flowId    | String | The id of the flow the report belongs to        |
| reportId  | String | The id of the report                            |

##### Syntax

```js
let report = kf.app.getReport(flowType, flowId, reportId);
```

### Get data

Returns the report's calculated rows.

##### Parameters

| Parameter          | type   | Description                                          |
| ------------------ | ------ | ---------------------------------------------------- |
| options.pageNumber | Number | Page to read. Defaults to 1                          |
| options.pageSize   | Number | Rows per page. Defaults to 50                        |
| options.payload    | Object | Sent to the report service as the request body. It does not filter a chart or card report |

##### Syntax

```js
let report = kf.app.getReport("Process", "Leave_Request_A00", "Requests_by_status_x1Yz");
let result = await report.getData({ pageSize: 20 });
```

##### Shape of the data

`getData()` returns the report service's answer as it is. The keys other than `Data` depend on the
report's type, so read them before you read the rows.

| Report type | Keys besides `Data` | What `Data` holds |
| ----------- | ------------------- | ----------------- |
| Chart       | `Columns` (the group), `Values`, sometimes `Rows` | One row per group. The group is under the `Id` of `Columns[0]`, each number under the `Id` of its entry in `Values` |
| Card (Simple, Icon, KPI, Comparison) | `FieldMapping` (label, description, icon, number format), `Values` | One row with the number under the `Id` of `Values[0]`. No row at all when no record matches |
| Tabular     | `Columns`, `Id`, `Name` | One row per record, each field under the `Id` of its entry in `Columns`, plus the record's `_id`. A user field arrives as a string |
| Pivot       | `Columns`, `Rows`, `Values`, `Formatting`, `DrilledMembers`, `FieldFilters` | Rows with their values as strings |

Every type also returns `Appearance`, `Filter`, `Sort`, `PageSize` and `Style`. A KPI card adds the
computed differences (absolute and percent difference, percentage of target and of change) to its row.

The pivot shape is taken from the report service's code and has not been run against a live app.

```js
// A chart report: the label of each group and its value
let { Columns, Values, Data } = await report.getData();
let groups = Data.map((row) => ({ label: row[Columns[0].Id], value: row[Values[0].Id] }));

// A card report: the single number, 0 when nothing matches
let card = await report.getData();
let number = card.Data[0]?.[card.Values[0].Id] ?? 0;
```

### Get count

Returns the number of rows a **tabular** report would return. Chart and card reports have no row count, so the service answers with an error; read their numbers with `getData()`.

```js
let count = await report.getCount();
```

### Get fields

Returns the fields of a **tabular** report. A chart or card report returns an empty list; its dimensions and values come back with `getData()`.

```js
let fields = await report.getFields();
```
