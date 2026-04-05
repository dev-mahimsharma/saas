"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppSelection() {
  const router = useRouter();

  const handleSelection = (paradigm) => {
    router.push(`/app-development?paradigm=${paradigm}`);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center mb-12 mt-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 font-sans">
          Choose Your Architecture
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Select your mobile development paradigm. Build once for all platforms or optimize for native performance.
        </p>
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 px-4">
        {/* Cross Platform Card */}
        <div 
          onClick={() => handleSelection("cross-platform")}
          className="bg-white rounded-[2rem] p-8 hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-blue-100 flex flex-col group min-h-[320px]"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v12H4z" opacity=".2" />
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12M8 10h8v2H8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Cross Platform</h2>
          <p className="text-slate-600 mb-8 flex-1 leading-relaxed">
            Build once for iOS & Android. Optimized for speed, unified logic, and rapid market deployment.
          </p>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">RECOMMENDED STACKS</p>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                <svg className="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2" fill="currentColor" /><g stroke="currentColor" strokeWidth="1.5" fill="none" transform="translate(12 12)"><ellipse rx="8" ry="3.2" /><ellipse rx="8" ry="3.2" transform="rotate(60)" /><ellipse rx="8" ry="3.2" transform="rotate(120)" /></g></svg>
                React Native
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor"><path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zM4.533 13.67l-2.23 2.224 4.7 4.696 2.06-2.05-4.53-4.87zM11.66 17.653l-2.4 2.387 4.14 4.14 8.6-8.58-2.61-2.6z"/></svg>
                Flutter
              </span>
            </div>
          </div>
        </div>

        {/* Native Card */}
        <div 
          onClick={() => handleSelection("native")}
          className="bg-white rounded-[2rem] p-8 hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-slate-300 flex flex-col group min-h-[320px]"
        >
          <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Native App</h2>
          <p className="text-slate-600 mb-8 flex-1 leading-relaxed">
            Maximum performance and deep OS integration. Unleash the full potential of device-specific capabilities.
          </p>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">RECOMMENDED STACKS</p>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M15.4 3.3L12 9l-3.4-5.7C7.3 1 5 1 5 1s2.5 1 4 4c0 0 1-1 3-3z"/></svg>
                Swift
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M2.3 2.3h19.4v19.4H2.3V2.3zm10 9.7L7.1 7.1v9.8l5.2-4.9z"/></svg>
                Kotlin
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <button onClick={() => router.back()} className="text-slate-500 font-bold hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 text-[15px]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Templates
        </button>
      </div>
    </div>
  );
}
