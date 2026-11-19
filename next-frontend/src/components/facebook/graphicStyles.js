
export const sinhalaFont = {
  fontFamily: "var(--font-sinhala), 'Noto Sans Sinhala', sans-serif",
};

export const FONT_SIZE = {
  short: 52,
  long: 45,
  threshold: 100,
  min: 40,
  max: 90,
  wideScale: 0.62,
};

export function getSinhalaHeadlineSize(titleSi = "") {
  const length = Array.from(titleSi.trim()).length;

  return length > FONT_SIZE.threshold
    ? FONT_SIZE.long
    : FONT_SIZE.short;
}

export const TEMPLATES = {
  alert: {
    label: "Alert Poster",
    hint: "4:5 · Feed post",
    w: 1080,
    h: 1350,
  },
  wide: {
    label: "Wide Card",
    hint: "1.91:1 · Link card",
    w: 1200,
    h: 630,
  },
};

export const THEMES = {
  alert: {
    label: "Alert Red",
    from: "#e11d2e",
    to: "#6b0812",
    chip: "#facc15",
  },
  pulse: {
    label: "Pulse Blue",
    from: "#0000e6",
    to: "#020a5c",
    chip: "#00ffff",
  },
  emerald: {
    label: "Emerald",
    from: "#00b894",
    to: "#013d33",
    chip: "#00ff9d",
  },
};

export const DEFAULT_IMG = {
  zoom: 1,
  x: 50,
  y: 50,
};

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
