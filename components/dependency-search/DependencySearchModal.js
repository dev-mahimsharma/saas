"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import DependencySuggestionItem from "./DependencySuggestionItem";
import { useDependencySearch } from "@/hooks/useDependencySearch";

export default function DependencySearchModal({
  isOpen,
  onClose,
  onSelect,
  selectedTargetLabel,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const { results, isLoading, error, hasSearched } = useDependencySearch(query, {
    enabled: isOpen,
    delay: 300,
  });

  useEffect(() => {
    if (!isOpen) return;

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [isOpen]);

  const primaryResult = useMemo(() => results[0] || null, [results]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!primaryResult) {
      return;
    }

    onSelect(primaryResult);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/70 px-4 py-8 backdrop-blur-sm overscroll-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-8 shrink-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Dependency Finder</p>
              <h3 className="mt-2 text-[30px] font-black tracking-tight text-slate-900">
                Add a package to {selectedTargetLabel || "your project"}
              </h3>
              <p className="mt-3 max-w-2xl text-[14px] font-medium leading-relaxed text-slate-500">
                Search for a dependency, then press Enter to add it instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-6">
              <div className="shrink-0">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Search Dependency
                </label>
                <div className="relative">
                  <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Type a package name fragment..."
                    className="h-[68px] w-full rounded-2xl border-2 border-slate-200 bg-white pl-14 pr-6 text-[16px] font-semibold text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Search Results
                  </p>
                  <p className="text-[12px] font-semibold text-slate-500">
                    npm + PyPI
                  </p>
                </div>

                {!query.trim() ? (
                  <p className="text-[13px] font-medium text-slate-400">
                    Start typing to search JavaScript and Python dependencies together.
                  </p>
                ) : null}

                {query.trim() && isLoading ? (
                  <p className="text-[13px] font-medium text-slate-500">Loading dependency suggestions...</p>
                ) : null}

                {query.trim() && !isLoading && error ? (
                  <p className="text-[13px] font-medium text-red-500">{error}</p>
                ) : null}

                {query.trim() && !isLoading && !error && hasSearched && results.length === 0 ? (
                  <p className="text-[13px] font-medium text-slate-400">No results found.</p>
                ) : null}

                {!isLoading && !error && results.length > 0 ? (
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 [scroll-behavior:smooth] overscroll-contain">
                    {results.map((result) => (
                      <DependencySuggestionItem
                        key={`${result.type}-${result.name}`}
                        result={result}
                        onSelect={onSelect}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
