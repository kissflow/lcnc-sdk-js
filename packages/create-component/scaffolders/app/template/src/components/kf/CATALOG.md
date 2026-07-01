# kf widget catalog

Every primitive available to compose pages, with props and when to use it. Import all
from `../components/kf`. **All data comes from the SDK — never mock.** Feed data widgets
from `kf.app.get*(id).getItems()` aggregations; show an empty state when there's no data.

## Layout & structure
| Component | Props | Use for |
|---|---|---|
| `PageHeader` | `title, accent, subtitle, children` | Page title bar; `children` → header actions (e.g. `NewButton`) |
| `Panel` | `title, children` | A titled glass card wrapping any widget |
| `Grid` | `cols={2\|3}, children` | Even multi-column row of panels |
| `Tabs` | `tabs:[{label,content}]` | Switch views (My Items / My Tasks) |
| `BigStat` | `value, gradient` | Hero headline number |
| `GhostButton` | `children` | Secondary pill button |
| `Callout` | `title, tone, icon, children` | Tinted banner / note |
| `EmptyState` | `title, hint, icon` | Honest "no data" placeholder |
| `Stepper` | `steps:[{label,state:'done'\|'current'\|'todo'}]` | Process/stage progress |

## KPIs & tiles
| Component | Props | Use for |
|---|---|---|
| `KpiRow` / `KpiCard` | `label, value, icon, tone, change?, trend?, spark?` | Headline metric cards (count-up) |
| `StatTile` | `label, value, delta?, deltaDir, icon, tone` | Compact metric with up/down delta |
| `GaugeRing` | `value, max, label, sublabel, tone` | Single ratio as a radial gauge |
| `ProgressBar` | `value, max, color` | One inline progress bar |
| `ProgressList` | `items:[{label,value,max?,display?,color?}]` | Several labelled progress bars |
| `StatusPill` | `label, tone` | Status/stage chip |

## Charts (data-driven, SVG/CSS, no deps)
| Component | Props | Use for |
|---|---|---|
| `BarChart` | `data:[{label,value,color?}], tone, format` | Vertical bars — compare categories |
| `HBars` | `data:[{label,value,color?}], tone, format, max` | Ranked horizontal bars — top-N |
| `LineChart` | `data:[{label,value}], tone, area, dots` | Trend over an ordered series |
| `Donut` + `Legend` | `segments:[{value,color}]`, `items:[{value,label,color}]` | Share / composition |
| `SegmentBar` | `segments:[{label,value,color}]` | One-row distribution (pipeline) |
| `StackedBar` | `data:[{label,...keyed}], keys:[{key,label,color}]` | Composition across rows |
| `FunnelChart` | `data:[{label,value,color?}], format` | Descending pipeline stages |
| `Heatmap` | `data:[{label,value}], tone, columns` | Intensity across a grid (by day/store) |
| `Chart` | `flowType, flowId, groupBy` | Auto bar chart bound straight to a model |

## Data, lists & feeds
| Component | Props | Use for |
|---|---|---|
| `DataTable` | `flowType, flowId, view?, max` | Records table; row click → `openForm` |
| `KanbanBoard` | `caseId, cardTitle, cardFields, groupField, cardIcon` | Board grouped by stage; drag-drop `updateItem` |
| `ActivityFeed` | `items:[{title,meta,time,color}]` | Recent activity / audit list |
| `Timeline` | `flowType, flowId, titleField, startField, endField, span, max` | Gantt of dated items (real dates only) |
| `StoresMap` | `stores:[{name,lat,lng}]` | Map — plots only real Geolocation coords |

## Forms & actions
| Component | Props | Use for |
|---|---|---|
| `NewButton` | `flowType, flowId, label` | "+ New" → native create form (`createItem`+`openForm`) |
| `FormCard` | `flowType, flowId, title, onCreated` | Inline create form |
| `ItemForm` | `flowType, flowId, item, onClose, onSaved` | Edit/Save/Submit an item |
| `NoAccess` | — | Render when a role can't access a gated widget |
| `CustomEmbed` | `url` | Embed an external custom UI |

## Helpers
`TONES` (indigo/violet/fuchsia/sky/emerald/amber/rose), `toneAt(i)`, `CountUp`,
`Skeleton`, `toast()`. Gate finance widgets with `useKfDev().canAccess(modelId) ? <w/> : <NoAccess/>`.
