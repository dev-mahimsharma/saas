"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToggleSwitch from "@/components/ToggleSwitch";
import Dropdown from "@/components/Dropdown";
import LiveStructurePreview from "@/components/LiveStructurePreview";
import { getStructureTree } from "@/data/structureTrees";

export default function AppConfigurator() {
  const router = useRouter();

  // App specific state
  const [projectName, setProjectName] = useState("my-mobile-app");
  const [paradigm, setParadigm] = useState("cross-platform"); // 'cross-platform' or 'native'
  const [stack, setStack] = useState("react-native"); // 'react-native', 'flutter', 'swift', 'kotlin'
  const [stateManagement, setStateManagement] = useState("Redux Toolkit + Thunk");
  const [dataLayer, setDataLayer] = useState("Axios + TanStack Query");
  const [feats, setFeats] = useState({ push: true, offline: false, deepLinking: true });

  const handleSetParadigm = (p) => {
    setParadigm(p);
    if (p === "cross-platform") setStack("react-native");
    if (p === "native") setStack("swift");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("paradigm");
      if (p === "native" || p === "cross-platform") {
        handleSetParadigm(p);
      }
    }
  }, []);

  const handleScaffold = () => {
    router.push(`/success?project=${encodeURIComponent(projectName)}&stack=${stack}`);
  };

  const treeNodes = useMemo(() => getStructureTree(stack), [stack]);

  return (
    <div className="flex-1 bg-slate-50 p-4 sm:p-8 lg:p-12 font-sans overflow-x-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[11px] font-black tracking-widest rounded-full uppercase">
              Pro Architect
            </span>
            <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              • VERSION 3.4.0
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Mobile App Configurator
          </h1>
          <p className="text-[17px] text-slate-600 leading-relaxed font-medium mb-6">
            Design and scaffold enterprise-grade mobile architectures. Choose your paradigm, define features, and witness your folder structure evolve in real-time.
          </p>

          <div className="max-w-sm">
            <label htmlFor="projectName" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Project Name</label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
              className="w-full bg-white border border-slate-200 text-slate-900 py-3.5 px-5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-[15px] shadow-sm hover:border-slate-300 transition-colors"
              placeholder="my-mobile-app"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
          {/* Left Column */}
          <div className="flex-1 space-y-12">

            {/* Step 1 */}
            <section>
              <h2 className="text-[13px] font-black flex items-center gap-3 tracking-widest text-slate-900 uppercase mb-6">
                <div className="text-blue-600 bg-blue-100 p-1 rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
                </div>
                Step 1: Development Paradigm
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cross-Platform Card */}
                <div
                  onClick={() => handleSetParadigm("cross-platform")}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${paradigm === "cross-platform" ? "border-blue-600 bg-white shadow-md ring-4 ring-blue-50" : "border-transparent bg-white shadow-sm hover:border-blue-200"}`}
                >
                  {paradigm === "cross-platform" && (
                    <div className="absolute top-5 right-5 text-blue-600 bg-blue-50 rounded-full p-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-5">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v12H4z" opacity=".2" /><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12M8 10h8v2H8z" /></svg>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-[19px] mb-2 tracking-tight">Cross-Platform</h3>
                  <p className="text-[14px] text-slate-500 mb-7 leading-relaxed">Build once for iOS & Android. Optimized for speed and unified logic.</p>
                  <div className="flex gap-2.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setParadigm("cross-platform"); setStack("react-native"); }}
                      className={`text-[10px] tracking-widest uppercase font-extrabold px-2.5 py-1.5 rounded-md transition-colors ${stack === "react-native" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      React Native
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setParadigm("cross-platform"); setStack("flutter"); }}
                      className={`text-[10px] tracking-widest uppercase font-extrabold px-2.5 py-1.5 rounded-md transition-colors ${stack === "flutter" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      Flutter
                    </button>
                  </div>
                </div>

                {/* Native Card */}
                <div
                  onClick={() => handleSetParadigm("native")}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${paradigm === "native" ? "border-blue-600 bg-white shadow-md ring-4 ring-blue-50" : "border-transparent bg-white shadow-sm hover:border-blue-200"}`}
                >
                  {paradigm === "native" && (
                    <div className="absolute top-5 right-5 text-blue-600 bg-blue-50 rounded-full p-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                  <div className="w-12 h-12 bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center mb-5">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-[19px] mb-2 tracking-tight">Native</h3>
                  <p className="text-[14px] text-slate-500 mb-7 leading-relaxed">Maximum performance and OS integration. Platform-specific excellence.</p>
                  <div className="flex gap-2.5 flex-wrap">
                    <button
                      onClick={(e) => { e.stopPropagation(); setParadigm("native"); setStack("swift"); }}
                      className={`text-[10px] tracking-widest uppercase font-extrabold px-2.5 py-1.5 rounded-md transition-colors ${stack === "swift" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      Swift (iOS)
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setParadigm("native"); setStack("kotlin"); }}
                      className={`text-[10px] tracking-widest uppercase font-extrabold px-2.5 py-1.5 rounded-md transition-colors ${stack === "kotlin" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      Kotlin (Android)
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <h2 className="text-[13px] font-black flex items-center gap-3 tracking-widest text-slate-900 uppercase mb-6">
                <div className="text-blue-600 bg-blue-100 p-1 rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                </div>
                Step 2: Core Stack Modules
              </h2>

              <div className="bg-slate-100/60 p-6 md:p-8 rounded-3xl mb-8 border border-slate-200/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 mb-3 uppercase tracking-widest">State Management</label>
                    <Dropdown
                      options={["Redux Toolkit + Thunk", "Zustand", "Jotai"]}
                      selected={stateManagement}
                      onChange={setStateManagement}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 mb-3 uppercase tracking-widest">Data Layer</label>
                    <Dropdown
                      options={["Axios + TanStack Query", "Apollo GraphQL", "tRPC"]}
                      selected={dataLayer}
                      onChange={setDataLayer}
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="block text-[11px] font-extrabold text-slate-500 mb-4 uppercase tracking-widest">Integrated Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ToggleSwitch
                    label="Push Notifications"
                    checked={feats.push}
                    onChange={(v) => setFeats({ ...feats, push: v })}
                  />
                  <ToggleSwitch
                    label="Offline Sync"
                    checked={feats.offline}
                    onChange={(v) => setFeats({ ...feats, offline: v })}
                  />
                  <ToggleSwitch
                    label="Deep Linking"
                    checked={feats.deepLinking}
                    onChange={(v) => setFeats({ ...feats, deepLinking: v })}
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <button
              onClick={handleScaffold}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 mt-8"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Scaffold Now
            </button>
          </div>

          {/* Right Column (Preview Box using LiveStructurePreview) */}
          <div className="lg:w-[440px] shrink-0 font-sans">
            <div className="sticky top-28">
              <LiveStructurePreview
                rootName={projectName || "my-mobile-app"}
                treeNodes={treeNodes}
                bundleLabel={stack === 'react-native' ? "~18.2 MB" : stack === 'flutter' ? "~15.6 MB" : "~5.2 MB"}
              />

              <div className="mt-5 flex gap-5">
                <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start font-sans">
                  <span className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mb-1">Est. Build Time</span>
                  <span className="text-xl font-black text-slate-900">{stack === 'react-native' ? "2.4m" : stack === 'flutter' ? "3.1m" : "1.8m"}</span>
                </div>
                <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start font-sans">
                  <span className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mb-1">Package Size</span>
                  <span className="text-xl font-black text-slate-900">{stack === 'react-native' ? "~18.2 MB" : stack === 'flutter' ? "~15.6 MB" : "~5.2 MB"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
