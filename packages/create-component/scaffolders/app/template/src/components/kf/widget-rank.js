/**
 * Widget ranking system — pick the RIGHT widget for a need.
 *
 * Describe the data/need as a `signal`, get back candidate widgets scored 0–10,
 * best first. Spans the kf data-viz library and shadcn/ui interaction components.
 *
 * signal = {
 *   need:        "visualize" | "input" | "navigate" | "overlay" | "action" | "layout",
 *   intent:      "trend" | "ranking" | "comparison" | "share" | "ratio" | "single-metric" |
 *                "distribution" | "composition" | "stages" | "intensity" | "geographic" |
 *                "schedule" | "records" | "board" | "activity" | "status" | "progress" |
 *                "choice" | "date" | "search" | "menu" | "confirm" | "detail-panel" | "tooltip" | "tabs",
 *   dataType:    "number"|"currency"|"select"|"date"|"geolocation"|"text"|"boolean"|null,
 *   cardinality: "one"|"few"|"many"|"lots"|null,   // few≤7, many 8–30, lots 30+
 *   isTimeSeries: boolean,
 *   hasData:     boolean,                          // false → prefer EmptyState, never fabricate
 * }
 */

const RULES = [
  // ---- kf data viz ----
  { w: "LineChart", lib: "kf", f: (s) => (s.intent === "trend" ? 10 : s.isTimeSeries ? 8 : 0) },
  { w: "HBars", lib: "kf", f: (s) => (s.intent === "ranking" ? 10 : s.intent === "comparison" && s.cardinality === "many" ? 8 : 0) },
  { w: "BarChart", lib: "kf", f: (s) => (s.intent === "comparison" ? 9 : s.intent === "ranking" ? 6 : 0) },
  { w: "Donut+Legend", lib: "kf", f: (s) => (s.intent === "share" ? (s.cardinality === "few" ? 10 : 7) : 0) },
  { w: "SegmentBar", lib: "kf", f: (s) => (s.intent === "distribution" ? 9 : s.intent === "share" && s.cardinality === "few" ? 7 : 0) },
  { w: "StackedBar", lib: "kf", f: (s) => (s.intent === "composition" ? 10 : 0) },
  { w: "FunnelChart", lib: "kf", f: (s) => (s.intent === "stages" ? 10 : 0) },
  { w: "Heatmap", lib: "kf", f: (s) => (s.intent === "intensity" ? 9 : 0) },
  { w: "GaugeRing", lib: "kf", f: (s) => (s.intent === "ratio" ? 10 : s.intent === "progress" ? 8 : 0) },
  { w: "KpiCard / BigStat", lib: "kf", f: (s) => (s.intent === "single-metric" ? 10 : 0) },
  { w: "StatTile", lib: "kf", f: (s) => (s.intent === "single-metric" ? 8 : 0) },
  { w: "ProgressList", lib: "kf", f: (s) => (s.intent === "progress" ? 9 : 0) },
  { w: "StoresMap", lib: "kf", f: (s) => (s.intent === "geographic" ? (s.dataType === "geolocation" && s.hasData ? 10 : 0) : 0) },
  { w: "Timeline", lib: "kf", f: (s) => (s.intent === "schedule" ? (s.dataType === "date" && s.hasData ? 10 : 0) : 0) },
  { w: "DataTable", lib: "kf", f: (s) => (s.intent === "records" ? 10 : s.need === "visualize" && s.cardinality === "lots" ? 5 : 0) },
  { w: "KanbanBoard", lib: "kf", f: (s) => (s.intent === "board" ? 10 : 0) },
  { w: "ActivityFeed", lib: "kf", f: (s) => (s.intent === "activity" ? 9 : 0) },
  { w: "EmptyState", lib: "kf", f: (s) => (s.hasData === false && s.need === "visualize" ? 6 : 0) },
  // ---- shadcn/ui interaction · input · overlay · navigation ----
  { w: "shadcn Badge", lib: "shadcn", f: (s) => (s.intent === "status" ? 9 : 0) },
  { w: "shadcn Select", lib: "shadcn", f: (s) => (s.need === "input" && s.intent === "choice" && (s.cardinality === "few" || s.cardinality === "many") ? 9 : 0) },
  { w: "shadcn Combobox", lib: "shadcn", f: (s) => (s.need === "input" && s.intent === "choice" && s.cardinality === "lots" ? 10 : 0) },
  { w: "shadcn Calendar / DatePicker", lib: "shadcn", f: (s) => (s.need === "input" && s.intent === "date" ? 10 : 0) },
  { w: "shadcn Command (⌘K)", lib: "shadcn", f: (s) => (s.intent === "search" ? 10 : 0) },
  { w: "shadcn DropdownMenu", lib: "shadcn", f: (s) => (s.intent === "menu" || (s.need === "action" && s.cardinality !== "one") ? 9 : 0) },
  { w: "shadcn Dialog", lib: "shadcn", f: (s) => (s.intent === "confirm" ? 9 : 0) },
  { w: "shadcn Sheet", lib: "shadcn", f: (s) => (s.intent === "detail-panel" ? 9 : 0) },
  { w: "shadcn Tooltip / Popover", lib: "shadcn", f: (s) => (s.intent === "tooltip" ? 9 : 0) },
  { w: "shadcn Tabs", lib: "shadcn", f: (s) => (s.need === "layout" && s.intent === "tabs" ? 8 : 0) },
  { w: "shadcn Switch / Checkbox", lib: "shadcn", f: (s) => (s.need === "input" && s.dataType === "boolean" ? 9 : 0) },
];

/** Rank all candidate widgets for a signal, best first. */
export function rankWidgets(signal) {
  return RULES
    .map((r) => ({ widget: r.w, lib: r.lib, score: r.f(signal) || 0 }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** The single best widget (or null). */
export function bestWidget(signal) {
  return rankWidgets(signal)[0] || null;
}

/** Derive a signal from a Kissflow field def + how it's being used. */
export function signalForField(field, { intent, need = "visualize", cardinality, hasData = true } = {}) {
  const t = String(field?.Type || field?.type || "").toLowerCase();
  const dataType = t.includes("currency") ? "currency"
    : t.includes("number") ? "number"
    : t.includes("date") ? "date"
    : t.includes("geo") ? "geolocation"
    : t.includes("select") || t.includes("status") ? "select"
    : t.includes("bool") || t.includes("yes") ? "boolean"
    : "text";
  return { need, intent, dataType, cardinality, hasData, isTimeSeries: dataType === "date" };
}
