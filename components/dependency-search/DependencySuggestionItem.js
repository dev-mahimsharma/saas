"use client";

export default function DependencySuggestionItem({ result, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(result)}
      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50/40"
    >
      <div className="min-w-0">
        <p className="truncate text-[15px] font-bold text-slate-900">{result.name}</p>
        <p className="mt-1 text-[12px] font-medium text-slate-500">Version {result.version}</p>
      </div>
      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
        {result.type}
      </span>
    </button>
  );
}
