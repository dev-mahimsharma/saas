"use client";

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 translate-x-0.5 transform rounded-full bg-white shadow ring-0 transition ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
