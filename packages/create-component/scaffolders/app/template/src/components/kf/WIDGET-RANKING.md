# Widget ranking — the right widget for the right need

A deterministic system for choosing widgets. Describe the need as a **signal**, score the
candidates, take the top. Engine: `widget-rank.js` (`rankWidgets(signal)` → sorted list,
`bestWidget(signal)`, `signalForField(field, opts)`). This rubric is the same logic in
prose for design-time reasoning.

## Signal
`{ need, intent, dataType, cardinality, isTimeSeries, hasData }`
- **need**: visualize · input · navigate · overlay · action · layout
- **cardinality**: one · few (≤7) · many (8–30) · lots (30+)
- **hasData: false** → prefer `EmptyState`; never fabricate (see kf-preferences `[HARD]`).

## Ranking matrix (intent → best → alternates)
| Intent (what the data/need is) | Best (10) | Alternates |
|---|---|---|
| trend over an ordered/time series | **LineChart** | BarChart |
| ranking / top-N | **HBars** | BarChart |
| compare a few categories | **BarChart** | HBars |
| share / composition of a whole (few) | **Donut+Legend** | SegmentBar, StackedBar |
| one-row distribution (pipeline split) | **SegmentBar** | Donut |
| composition across rows | **StackedBar** | — |
| descending stages | **FunnelChart** | SegmentBar |
| intensity over a grid (by day/store) | **Heatmap** | HBars |
| single ratio / % | **GaugeRing** | ProgressBar |
| single headline metric | **KpiCard / BigStat** | StatTile |
| progress toward targets | **ProgressList** | GaugeRing |
| geographic (real geo data) | **StoresMap** | — (else EmptyState) |
| schedule (real start/end dates) | **Timeline** | — (else EmptyState) |
| record detail | **DataTable** | — |
| stage board | **KanbanBoard** | — |
| recent activity | **ActivityFeed** | DataTable |
| status value | **shadcn Badge / StatusPill** | — |
| choice input (few/many) | **shadcn Select** | — |
| choice input (lots) | **shadcn Combobox** | — |
| date input | **shadcn Calendar / DatePicker** | — |
| quick search / jump | **shadcn Command (⌘K)** | — |
| row/page actions menu | **shadcn DropdownMenu** | — |
| confirm / focused form | **shadcn Dialog** | — |
| side detail panel | **shadcn Sheet** | — |
| contextual hint | **shadcn Tooltip / Popover** | — |
| boolean input | **shadcn Switch / Checkbox** | — |
| switch views | **shadcn Tabs / kf Tabs** | — |

## How the architect/ui use it
1. For each thing a page must show or capture, build a signal (use `signalForField` for a
   bound field). 2. Take `bestWidget(signal)`. 3. If `hasData` is false or no widget scores,
   use `EmptyState` or drop it — never invent data. 4. Record any user override of a pick
   in `lib/kf-preferences.md` so the next run ranks it the way they prefer.
