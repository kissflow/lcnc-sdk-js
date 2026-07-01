// Vibrant tone palette for kf primitives. Cycle through for visual variety.
export const TONES = {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  sky: "#0ea5e9",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
};

export const TONE_CYCLE = ["indigo", "emerald", "amber", "rose", "violet", "sky", "fuchsia"];

export const toneAt = (i) => TONES[TONE_CYCLE[i % TONE_CYCLE.length]];
