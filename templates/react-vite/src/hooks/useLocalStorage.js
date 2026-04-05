import { useEffect, useState } from "react";

function readStored(key, initial) {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => readStored(key, initial));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue];
}
