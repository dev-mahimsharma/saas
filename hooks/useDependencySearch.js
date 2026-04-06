"use client";

import { useEffect, useMemo, useState } from "react";

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

export function useDependencySearch(query, { enabled = true, delay = 300 } = {}) {
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, delay);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!enabled || !debouncedQuery) {
      setResults([]);
      setIsLoading(false);
      setError("");
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();

    async function runSearch() {
      setIsLoading(true);
      setError("");
      setHasSearched(true);

      try {
        const response = await fetch(`/api/dependency-search?q=${encodeURIComponent(debouncedQuery)}`, {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to search dependencies right now.");
        }

        const data = await response.json();
        setResults(Array.isArray(data?.results) ? data.results : []);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        setResults([]);
        setError("Unable to load dependency suggestions right now.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    runSearch();

    return () => controller.abort();
  }, [debouncedQuery, enabled]);

  return useMemo(
    () => ({
      results,
      isLoading,
      error,
      hasSearched,
      debouncedQuery,
    }),
    [results, isLoading, error, hasSearched, debouncedQuery]
  );
}
