"use client";
import { useState, useRef, useEffect } from "react";

export default function Dropdown({ options, selected, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border border-slate-200 py-3.5 px-5 rounded-xl outline-none font-bold text-[15px] shadow-sm transition-colors ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : "hover:border-slate-300"} text-slate-900`}
      >
        <span>{selected || placeholder}</span>
        <svg className={`fill-current h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl ring-1 ring-slate-900/5">
          <div className="p-1.5 max-h-60 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`w-full text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                  opt === selected 
                    ? "bg-blue-50 text-blue-700 font-bold" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
