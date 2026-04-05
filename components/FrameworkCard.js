"use client";

export default function FrameworkCard({
  title,
  description,
  selected,
  onClick,
  icon,
  checkPosition = "bottom",
}) {
  const checkCorner =
    checkPosition === "top" ? "right-3 top-3" : "bottom-3 right-3";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-1 flex-col rounded-xl border-2 p-4 text-left transition ${
        selected
          ? "border-blue-600 bg-blue-50/50 shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {selected ? (
        <span
          className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white ${checkCorner}`}
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      ) : null}
      <div className="mb-3 text-blue-600">{icon}</div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </button>
  );
}
