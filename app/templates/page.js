"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center mb-12 mt-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 font-sans">
          What are we building today?
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Select a stack to initialize your environment. bootNode will handle the
          scaffolding, cloud provisioning, and boilerplate.
        </p>
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 px-4">
        {/* Web Development Card */}
        <div 
          onClick={() => router.push("/web-development")}
          className="bg-white rounded-[2rem] p-8 hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-blue-100 flex flex-col group min-h-[320px]"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Web Development</h2>
          <p className="text-slate-600 mb-8 flex-1 leading-relaxed">
            Scalable architectures for modern browsers. Deploy enterprise-grade SSR and CSR applications instantly.
          </p>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">SUPPORTED ECOSYSTEM</p>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                <svg className="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2" fill="currentColor" /><g stroke="currentColor" strokeWidth="1.5" fill="none" transform="translate(12 12)"><ellipse rx="8" ry="3.2" /><ellipse rx="8" ry="3.2" transform="rotate(60)" /><ellipse rx="8" ry="3.2" transform="rotate(120)" /></g></svg>
                React
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l12 24H0L12 0z"/></svg> 
                Next.js
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Node.js
              </span>
            </div>
          </div>
        </div>

        {/* App Development Card */}
        <div 
          onClick={() => router.push("/app-selection")}
          className="bg-white rounded-[2rem] p-8 hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-blue-100 flex flex-col group min-h-[320px]"
        >
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">App Development</h2>
          <p className="text-slate-600 mb-8 flex-1 leading-relaxed">
            Native performance for iOS and Android. Cross-platform excellence with unified build pipelines.
          </p>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">SUPPORTED ECOSYSTEM</p>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                <svg className="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2" fill="currentColor" /><g stroke="currentColor" strokeWidth="1.5" fill="none" transform="translate(12 12)"><ellipse rx="8" ry="3.2" /><ellipse rx="8" ry="3.2" transform="rotate(60)" /><ellipse rx="8" ry="3.2" transform="rotate(120)" /></g></svg>
                React Native
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor"><path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zM4.533 13.67l-2.23 2.224 4.7 4.696 2.06-2.05-4.53-4.87zM11.66 17.653l-2.4 2.387 4.14 4.14 8.6-8.58-2.61-2.6z"/></svg>
                Flutter
              </span>
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
        <p className="text-slate-500 mb-3 text-sm">Unsure about which stack to pick?</p>
        <Link href="/stack-explorer" className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-1.5 text-[15px]">
          Consult the bootNode Stack Explorer
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
