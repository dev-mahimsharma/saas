"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LiveStructurePreview from "@/components/LiveStructurePreview";
import { getStructureTree } from "@/data/structureTrees";
import { generateProject } from "@/lib/downloadZip";
import { safeProjectName } from "@/lib/safeProjectName";

const PRESETS = [
  {
    id: "next",
    stack: "next",
    title: "Next.js",
    description: "Optimized for SEO and performance with App Router.",
  },
  {
    id: "mern",
    stack: "mern",
    title: "MERN Stack",
    description: "Full-stack MongoDB, Express, React, and Node.js.",
  },
  {
    id: "django",
    stack: "django",
    title: "Django + React",
    description: "Vite-powered React frontend with Python backend.",
  },
  {
    id: "html",
    stack: "html",
    title: "Static Web",
    description: "Pure HTML5, CSS3, and modern JavaScript modules.",
  },
];

function IconNext() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111] text-white">
      <svg className="h-6 w-6" viewBox="0 0 128 128" fill="currentColor">
        <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm0 121.6C32.2 121.6 6.4 95.8 6.4 64S32.2 6.4 64 6.4 121.6 32.2 121.6 64 95.8 121.6 64 121.6z"/>
        <path d="M85.4 39.5L42.5 95V39.5h-5.2v53.1h4.2l44.3-57.9v41.3h5.2V39.5h-5.6z"/>
      </svg>
    </div>
  );
}

function IconMern() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 12l9.75-4.5m-9.75 9l4.179 2.25L21.75 12l-4.179-2.25" />
      </svg>
    </div>
  );
}

function IconDjango() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M14 6l-6 4v4l6 4l6-4V10L14 6z" />
        <path d="M8 10l-6 4v4l6 4" />
      </svg>
    </div>
  );
}

function IconHtml() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-bold text-xs uppercase">
      HTML
    </div>
  );
}

function CustomPresetCard({ title, description, selected, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-start gap-4 rounded-xl border p-5 text-left transition-all w-full ${
        selected
          ? "border-blue-500 bg-blue-50/20 ring-1 ring-blue-500 shadow-sm"
          : "border-slate-200 bg-slate-50 hover:bg-slate-100/60"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        {icon}
        {selected && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
      </div>
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const [presetId, setPresetId] = useState("next");
  const [language, setLanguage] = useState("ts"); // 'ts' or 'js'
  const [projectNameInput, setProjectNameInput] = useState("my-awesome-app");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selected = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const rootName = useMemo(() => safeProjectName(projectNameInput) || "my-awesome-app", [projectNameInput]);
  const treeNodes = getStructureTree(selected.stack, language);

  const bundleLabel = useMemo(() => {
    const map = { html: "~4 MB", react: "~18 MB", django: "~22 MB", next: "~28 MB", mern: "~32 MB" };
    return map[selected.stack] ?? "~zip";
  }, [selected.stack]);

  const hasAutoFired = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && status === "authenticated" && !hasAutoFired.current) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auto") === "true") {
        hasAutoFired.current = true;
        const pStack = params.get("stack") || selected.stack;
        const pProject = params.get("project") || projectNameInput;
        const pLang = params.get("lang") || language;
        setPresetId(pStack);
        setProjectNameInput(pProject);
        setLanguage(pLang);
        handleCreate(pStack, pProject, pLang);
      }
    }
  }, [status]);

  async function handleCreate(overrideStack, overrideProject, overrideLang) {
    const targetStack = typeof overrideStack === "string" ? overrideStack : selected.stack;
    const targetProject = typeof overrideProject === "string" ? overrideProject : projectNameInput;
    const targetLang = typeof overrideLang === "string" ? overrideLang : language;

    if (status !== "authenticated") {
      const autoQs = new URLSearchParams({ auto: "true", stack: targetStack, project: targetProject, lang: targetLang });
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent((pathname || "/web-development") + "?" + autoQs.toString())}`);
      return;
    }

    setError("");
    setBusy(true);
    try {
      const { sizeKb, projectRoot, filename } = await generateProject({
        stack: targetStack,
        projectName: targetProject,
        language: targetLang,
        returnTo: pathname || "/web-development",
      });
      const q = new URLSearchParams({
        project: projectRoot,
        size: sizeKb,
        stack: targetStack,
        file: filename,
      });
      router.push(`/success?${q.toString()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const icons = {
    next: <IconNext />,
    django: <IconDjango />,
    html: <IconHtml />,
    mern: <IconMern />,
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] font-sans selection:bg-blue-200">
      
      {/* Title Section (Exactly matching image) */}
      <section className="bg-[#F9FAFB]">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 lg:items-start">
          
          <div className="flex-1 flex flex-col mt-4">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-[40px] mb-3">
              Configure Your Stack
            </h1>
            <p className="text-[17px] text-slate-600 font-medium mb-10">
              Define your architecture and generate a clean, production-ready starting point.
            </p>

            {/* PROJECT IDENTITY */}
            <div className="mb-6">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 mb-3 block">
                 PROJECT IDENTITY
               </label>
               <div className="relative">
                 <input
                   value={projectNameInput}
                   onChange={(e) => setProjectNameInput(e.target.value)}
                   className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white flex items-center pr-12"
                   placeholder="my-awesome-app"
                   autoComplete="off"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3.6 5.5l-6 6c-.2.2-.5.3-.7.3s-.5-.1-.7-.3l-2.4-2.4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.7 1.7 5.3-5.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4z"/></svg>
                 </div>
               </div>
            </div>

            {/* STARTER PRESETS BOX */}
            <div className="border-[1.5px] border-blue-200 rounded-2xl p-6 bg-white shadow-sm shadow-blue-100/30 mb-6">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5">
                  <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-800">STARTER PRESETS</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">Select your base architecture</p>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 right-controls">
                     <p className="text-[9px] font-black uppercase tracking-[0.1em] text-blue-600 mb-2 sm:text-right hidden sm:block">CHOOSE YOUR PREFERRED LANGUAGE</p>
                     <div className="flex gap-3 sm:ml-auto w-max mt-1">
                        <button 
                          onClick={() => setLanguage("ts")}
                          className={`relative flex cursor-pointer w-14 h-14 rounded-xl transition-all ${language === 'ts' ? 'bg-[#3178C6] shadow-md text-white border-2 border-[#3178C6] ring-2 ring-[#3178C6]/20 ring-offset-1' : 'bg-white border-2 border-[#3178C6]/30 text-[#3178C6]/70 hover:border-[#3178C6] hover:text-[#3178C6] hover:bg-[#3178C6]/5'}`}
                        >
                          <span className="absolute bottom-1 right-2 text-[12px] font-black uppercase tracking-wider">TS</span>
                        </button>
                        <button 
                          onClick={() => setLanguage("js")}
                          className={`relative flex cursor-pointer w-14 h-14 rounded-xl transition-all ${language === 'js' ? 'bg-[#F7DF1E] shadow-md text-white border-2 border-[#F7DF1E] ring-2 ring-[#F7DF1E]/20 ring-offset-1' : 'bg-white border-2 border-[#F7DF1E]/50 text-[#d4b910] hover:border-[#F7DF1E] hover:text-[#c5ac0e] hover:bg-[#F7DF1E]/10'}`}
                        >
                          <span className="absolute bottom-1 right-2 text-[12px] font-black uppercase tracking-wider drop-shadow-sm">JS</span>
                        </button>
                     </div>
                  </div>
               </div>

               <div className="grid gap-4 sm:grid-cols-2">
                 {PRESETS.map((p) => (
                   <CustomPresetCard
                     key={p.id}
                     title={p.title}
                     description={p.description}
                     selected={presetId === p.id}
                     onClick={() => setPresetId(p.id)}
                     icon={icons[p.id]}
                   />
                 ))}
               </div>
            </div>

            {/* Advanced config link */}
            <Link href="/stack-explorer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm cursor-pointer mb-2 group w-max">
               <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
               Advanced Configuration
               <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
            </Link>
            <p className="text-[12px] text-slate-400 font-medium mb-10 w-full max-w-[340px] leading-relaxed">
               Click here for full customization, additional tech stacks, and advanced project architecture options.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
               type="button"
               disabled={busy || status === "loading"}
               onClick={() => handleCreate()}
               className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#116EF9] py-4 text-[16px] font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#0052cc] hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-60"
            >
               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
               {status === "loading"
                 ? "Checking session..."
                 : busy
                   ? "Preparing archive..."
                   : "Create & Download Project"}
            </button>
          </div>
          
          {/* Right Column: Structure Preview */}
          <div className="lg:w-[440px] shrink-0 font-sans sticky top-28">
            <LiveStructurePreview
              rootName={rootName}
              treeNodes={treeNodes}
              bundleLabel={bundleLabel}
            />
          </div>
          
        </div>
      </section>
    </div>
  );
}
