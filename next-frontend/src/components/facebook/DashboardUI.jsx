
export const fieldClass =
  "dashboard-field w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 dark:border-dark-border dark:bg-dark-surface dark:text-white dark:focus:border-light-cyan/60 dark:focus:ring-light-cyan/20";

export function Field({ label, children, right }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {right}
      </div>

      {children}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
}) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>{label}</span>
        <span>
          {value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-600 dark:accent-[#00ffff]"
      />
    </label>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
        checked
          ? "border-cyan-600/60 bg-cyan-600/10 text-cyan-700 dark:border-light-cyan/60 dark:bg-light-cyan/10 dark:text-light-cyan"
          : "border-slate-300 text-slate-500 hover:text-slate-900 dark:border-dark-border dark:text-slate-400 dark:hover:text-slate-200"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          checked
            ? "bg-cyan-600 dark:bg-light-cyan"
            : "bg-slate-400 dark:bg-slate-600"
        }`}
      />

      {label}
    </button>
  );
}
