---
title: Report
description: Read a flow report's calculated data
---

A report is a saved view of a flow's data, worked out by Kissflow: a chart's groups and values, or a
card's single number. Reading a report takes one call, instead of reading every record and adding it up
on the page.

Reports belong to a Form (DataForm), Process or Case flow. Datasets and lists have no reports.

Get a report instance using `getReport` from app's interface. No request is sent until you call one of
its methods.

##### Parameters

| Parameter | type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| flowType  | String | `"Form"`, `"Process"` or `"Case"`               |
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
| options.pageNumber | Number | Page to read, a whole number from 1. Defaults to 1   |
| options.pageSize   | Number | Rows per page, a whole number from 1 to 100. Defaults to 50 |
| options.payload    | Object | Sent to the report service as the request body. To filter at read time, pass the report's parameters in it: `{ FilterParam: { "$<parameter name>": "text" } }`. See Filtering at read time |

##### Syntax

```js
let report = kf.app.getReport("Process", "Leave_Request_A00", "Requests_by_status_x1Yz");
let result = await report.getData({ pageSize: 20 });
```

##### Filtering at read time

A report filters by its own definition. A condition in that definition can be left open as a **parameter**: a named
value the reader sets when reading. Send parameters under `FilterParam`, each name starting with `$`:

```js
let result = await report.getData({ payload: { FilterParam: { "$status": "Completed", "$min": "3" } } });
```

- A parameter you do not send is skipped, so the report stays whole.
- Send values as **text**, in the form the field takes. Kissflow skips a condition whose value is falsy and reads a wrong
  form as no filter, so the report comes back whole with no error. A number `0`, `""`, `false` and `[]` are skipped; `"0"` and
  `"false"` are values. A date is `YYYY-MM-DD`. A date-time is `YYYY-MM-DDTHH:mm:ssZ` with no milliseconds. A boolean is
  `"true"` or `"false"` in lowercase. A user is the id as text.
- A list for a "part of" condition may be an array, `"a,b"` or `'["a","b"]'`. A person is `{ "_id": "..." }`.
- A date range is two parameters, one on "greater than or equal to" and one on "less than or equal to". A "between"
  condition with a parameter fails with a 500.
- The `$` is part of the name, and a name the report does not declare is ignored without an error.
- `"Other"` means "is empty".
- A chart also has a parameter named after the field it groups by: `$` plus the `Id` of `Columns[0]` in its answer.
- Parameters work on every report type, and on a table's `getCount()`. Any other payload key (`Filter`,
  `ComponentFilter`) is ignored.

##### Shape of the data

`getData()` returns the report service's answer as it is. The keys other than `Data` depend on the
report's type, so read them before you read the rows.

| Report type | Keys besides `Data` | What `Data` holds |
| ----------- | ------------------- | ----------------- |
| Chart (any of the 14 views) | `Columns` (the group), `Values`, and `Rows` when the chart has a series | One row per group. The group is under the `Id` of `Columns[0]`, each number under the `Id` of its entry in `Values`. With a series and one measure, each segment is its own key: `{ "Column_…": "Annual", "Completed": 6, "InProgress": 7 }` |
| Card (Simple, Icon, KPI, Comparison) | `FieldMapping` (label, description, icon, number format, prefix, suffix), `Values` | One row with the number under the `Id` of `Values[0]`. A KPI or Comparison card also has its target under `Values[1]`, and a KPI card adds `ABSOLUTE_DIFFERENCE`. No row at all when no record matches |
| Tabular     | `Columns`, `Id`, `Name` | One row per record, each field under the `Id` of its entry in `Columns`, plus the record's `_id`. A user field arrives as a string |
| Pivot       | `Columns`, `Rows`, `Values`, `Formatting`, `DrilledMembers`, `FieldFilters` | Flat rows, one per row-by-column group, keyed by the `Column_`, `Row_` and `Value_` ids |

Every type also returns `Appearance`, `Filter`, `Sort`, `PageSize` and `Style`. A date grouped by
month, year or day arrives as a number (10 for October).

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
