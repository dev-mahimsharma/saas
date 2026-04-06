"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, X, Plus } from "lucide-react";

const STEPS = [
  { id: 1, title: "Project Identity" },
  { id: 2, title: "Architecture Stack" },
  { id: 3, title: "Styling Engine" },
  { id: 4, title: "UI Components" },
  { id: 5, title: "Dependencies" },
  { id: 6, title: "Configuration" },
];

const STACKS = [
  { id: "next", name: "Next.js", desc: "React Framework for the Web" },
  { id: "mern", name: "MERN Stack", desc: "MongoDB, Express, React, Node" },
  { id: "django", name: "Django + React", desc: "Python Backend with Vite" },
  { id: "vanilla", name: "Vanilla HTML/JS", desc: "No build step required" },
];

const STYLING_ENGINES = [
  { id: "tailwind", name: "Tailwind CSS", desc: "Utility-first framework" },
  { id: "bootstrap", name: "Bootstrap", desc: "Component-based framework" },
  { id: "scss", name: "SCSS/SASS", desc: "Pre-processor stylesheets" },
  { id: "unocss", name: "UnoCSS", desc: "Instant atomic CSS engine" },
];

const UI_LIBRARIES = [
  { id: "shadcn", name: "Shadcn UI", icon: "S" },
  { id: "mui", name: "Material UI", icon: "M" },
  { id: "radix", name: "Radix UI", icon: "R" },
  { id: "ant", name: "Ant Design", icon: "A" },
  { id: "nextui", name: "NextUI", icon: "N" },
  { id: "mantine", name: "Mantine", icon: "m" },
  { id: "headless", name: "Headless UI", icon: "H" },
];

const LICENSES = [
  { id: "mit", name: "MIT License", desc: "A short and completely permissive." },
  { id: "apache", name: "Apache 2.0", desc: "Permissive with patent rights." },
  { id: "gpl3", name: "GNU GPLv3", desc: "Strong copyleft requirement." },
  { id: "bsd3", name: "BSD 3-Clause", desc: "Permissive with minimal restrictions." },
  { id: "none", name: "No License", desc: "All rights reserved (Closed)." },
];

const SUGGESTIONS = {
  next: ["clsx", "tailwind-merge", "lucide-react", "zustand"],
  mern: ["mongoose", "jsonwebtoken", "cors", "axios"],
  django: ["axios", "react-router-dom", "framer-motion"],
  vanilla: ["gsap", "axios", "sweetalert2"],
};

export default function VerticalProjectWizard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // States
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("ts");
  const [stack, setStack] = useState("");
  const [styling, setStyling] = useState("");
  const [uiLib, setUiLib] = useState("");
  const [depInput, setDepInput] = useState("");
  const [dependencies, setDependencies] = useState([]);

  // Step 6 States
  const [license, setLicense] = useState("mit");
  const [includeTests, setIncludeTests] = useState(false);
  const [includeReadme, setIncludeReadme] = useState(true);
  const [readmeContent, setReadmeContent] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("wizard_state_v2");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.projectName) setProjectName(p.projectName);
        if (p.language) setLanguage(p.language);
        if (p.stack) setStack(p.stack);
        if (p.styling !== undefined) setStyling(p.styling);
        if (p.uiLib !== undefined) setUiLib(p.uiLib);
        if (p.dependencies) setDependencies(p.dependencies);
        if (p.currentStep) setCurrentStep(p.currentStep);
        if (p.license) setLicense(p.license);
        if (p.includeTests !== undefined) setIncludeTests(p.includeTests);
        if (p.includeReadme !== undefined) setIncludeReadme(p.includeReadme);
        if (p.readmeContent !== undefined) setReadmeContent(p.readmeContent);
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    sessionStorage.setItem("wizard_state_v2", JSON.stringify({
      projectName, language, stack, styling, uiLib, dependencies, currentStep,
      license, includeTests, includeReadme, readmeContent
    }));
  }, [projectName, language, stack, styling, uiLib, dependencies, currentStep, license, includeTests, includeReadme, readmeContent, mounted]);

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep((prev) => prev + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleAddDep = (e) => {
    e.preventDefault();
    if (depInput.trim() && !dependencies.includes(depInput.trim())) {
      setDependencies([...dependencies, depInput.trim()]);
    }
    setDepInput("");
  };

  const handleComplete = () => {
    const q = new URLSearchParams({
      project: projectName || "my-app",
      stack: stack || "next",
      lang: language,
      style: styling || "none",
      uilib: uiLib || "none",
      deps: dependencies.join(","),
      license: license || "none",
      tests: includeTests.toString(),
      readme: includeReadme ? "true" : "false",
    });
    router.push(`/project/preview?${q.toString()}`);
  };

  const renderDot = (step) => {
    const isActive = step.id === currentStep;
    const isCompleted = step.id < currentStep;

    if (isCompleted) {
      return (
        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/40 transition-all duration-300">
          <Check size={16} strokeWidth={3} />
        </div>
      );
    }
    if (isActive) {
      return (
        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-blue-600 bg-white shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-300">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
        </div>
      );
    }
    return (
      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-slate-200 bg-white transition-all duration-300" />
    );
  };

  if (!mounted) return null;

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 mt-2">
            <div>
               <h2 className="text-[28px] font-black text-slate-900 tracking-tight">Project Identity</h2>
               <p className="text-slate-500 text-[14px] mt-1 mb-8">Define the core blueprint and language signature of your application.</p>
            </div>
            
            <div className="space-y-6">
              <div>
                 <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Project Name</label>
                 <input
                   type="text"
                   autoFocus
                   value={projectName}
                   onChange={(e) => setProjectName(e.target.value)}
                   placeholder="e.g., my-awesome-app"
                   className="w-full bg-white border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-[15px]"
                 />
              </div>

              <div>
                 <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Programming Language</label>
                 <div className="flex gap-3">
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
              
              <div className="pt-6 flex gap-4">
                <button
                  onClick={nextStep}
                  disabled={!projectName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md w-max"
                >
                  Continue
                </button>
                <div className="relative group">
                  <button disabled className="text-slate-400 cursor-not-allowed font-bold px-8 py-4 rounded-xl bg-slate-50 border border-slate-200">
                    Skip
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg pointer-events-none shadow-lg z-10 before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-slate-800">
                    Required fields cannot be skipped
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 mt-2">
            <div>
               <h2 className="text-[28px] font-black text-slate-900 tracking-tight">Select Architecture</h2>
               <p className="text-slate-500 text-[14px] mt-1 mb-8">Choose the primary backend and frontend engine to power your servers.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {STACKS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStack(s.id)}
                  className={`flex flex-col text-left p-5 rounded-xl border-2 transition-all cursor-pointer group ${
                    stack === s.id
                      ? "bg-blue-50/50 border-blue-600 shadow-sm shadow-blue-100"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <span className={`text-[15px] font-bold ${stack === s.id ? 'text-blue-700' : 'text-slate-800'}`}>
                    {s.name}
                  </span>
                  <span className="text-[13px] text-slate-500 mt-1.5 font-medium leading-relaxed">{s.desc}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4 pt-6">
              <button
                onClick={nextStep}
                disabled={!stack}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold px-10 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Continue
              </button>
              <div className="relative group">
                <button disabled className="text-slate-400 cursor-not-allowed font-bold px-8 py-4 rounded-xl bg-slate-50 border border-slate-200">
                  Skip
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg pointer-events-none shadow-lg z-10 before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-slate-800">
                  Required fields cannot be skipped
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 mt-2">
            <div>
               <h2 className="text-[28px] font-black text-slate-900 tracking-tight">Styling Engine</h2>
               <p className="text-slate-500 text-[14px] mt-1 mb-6">Select your preferred CSS framework or engine architecture.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {STYLING_ENGINES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyling(s.id)}
                  className={`flex flex-col text-left p-5 rounded-xl cursor-pointer border-2 transition-all group ${
                    styling === s.id
                      ? "bg-blue-50/50 border-blue-600 shadow-sm shadow-blue-100"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <span className={`text-[15px] font-bold ${styling === s.id ? 'text-blue-700' : 'text-slate-800'}`}>
                    {s.name}
                  </span>
                  <span className="text-[13px] text-slate-500 mt-1.5 font-medium leading-relaxed">{s.desc}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4 pt-6">
              <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold px-10 py-4 rounded-xl shadow-md transition-all">
                Continue
              </button>
              <button onClick={() => { setStyling(""); nextStep(); }} className="text-slate-500 cursor-pointer hover:text-slate-800 font-bold px-6 py-4 rounded-xl transition-all bg-white border border-slate-200">
                Skip
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 mt-2">
            <div>
               <h2 className="text-[28px] font-black text-slate-900 tracking-tight">UI Components</h2>
               <p className="text-slate-500 text-[14px] mt-1 mb-6">Pre-built component libraries to accelerate interface design.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {UI_LIBRARIES.map((lib) => (
                <button
                  key={lib.id}
                  onClick={() => setUiLib(lib.id)}
                  className={`flex flex-col items-center justify-center cursor-pointer p-5 rounded-xl border-2 transition-all text-center ${
                    uiLib === lib.id
                      ? "bg-blue-50/50 border-blue-600 text-blue-700 shadow-sm shadow-blue-100"
                      : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-3 ${uiLib === lib.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {lib.icon}
                  </div>
                  <span className="font-bold text-[13px]">{lib.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4 pt-6">
              <button onClick={nextStep} className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl shadow-md transition-all">
                Continue
              </button>
              <button onClick={() => { setUiLib(""); nextStep(); }} className="text-slate-500 cursor-pointer hover:text-slate-800 font-bold px-6 py-4 rounded-xl transition-all bg-white border border-slate-200">
                Skip
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 mt-2">
            <div>
               <h2 className="text-[28px] font-black text-slate-900 tracking-tight">Dependencies</h2>
               <p className="text-slate-500 text-[14px] mt-1 mb-6">Inject NPM packages securely before the generator runs.</p>
            </div>
            <div>
              <form onSubmit={handleAddDep} className="flex flex-col sm:flex-row gap-3 relative mt-2">
                <div className="flex-1">
                   <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Package Name</label>
                   <input
                     type="text"
                     value={depInput}
                     onChange={(e) => setDepInput(e.target.value)}
                     placeholder="e.g. framer-motion, zod"
                     className="w-full bg-white border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                   />
                </div>
                <button type="submit" className="bg-slate-800 text-white cursor-pointer rounded-xl px-8 h-[56px] self-end font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                  <Plus size={18} /> Add
                </button>
              </form>

              {/* Dependencies Grid */}
              <div className="mt-8 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 min-h-[160px]">
                 <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-4">Required Injectables</div>
                 {dependencies.length === 0 ? (
                   <p className="text-[13px] text-slate-400 font-medium italic">No dependencies added yet. Press Enter to submit.</p>
                 ) : (
                   <div className="grid grid-cols-2 gap-3 pb-2">
                     {dependencies.map(dep => (
                       <div key={dep} className="flex items-center justify-between bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm">
                         <span className="font-bold text-[13px] text-slate-700 truncate mr-2">{dep}</span>
                         <button onClick={() => setDependencies(dependencies.filter(d => d !== dep))} className="text-slate-400 cursor-pointer hover:text-red-500 transition-colors shrink-0">
                           <X size={16} />
                         </button>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            </div>

            <div className="flex gap-4 pt-6 pb-20 w-full">
              <button onClick={nextStep} className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl shadow-md transition-all">
                Continue
              </button>
              <button onClick={() => { setDependencies([]); nextStep(); }} className="text-slate-500 cursor-pointer hover:text-slate-800 font-bold px-6 py-4 rounded-xl transition-all bg-white border border-slate-200">
                Skip
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8 mt-2">
            <div>
               <h2 className="text-[28px] font-black text-slate-900 tracking-tight">Global Configuration</h2>
               <p className="text-slate-500 text-[14px] mt-1 mb-6">Finalize structural directories, access controls, and repository documentation.</p>
            </div>
            
            <div className="space-y-8">
              {/* License Cards */}
              <div>
                 <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Project License</label>
                 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                   {LICENSES.map((lic) => (
                     <button
                       key={lic.id}
                       onClick={() => setLicense(lic.id)}
                       className={`flex flex-col items-start p-4 rounded-xl cursor-pointer border-2 transition-all group text-left ${
                         license === lic.id
                           ? "bg-blue-50/50 border-blue-600 shadow-sm shadow-blue-100"
                           : "bg-white border-slate-200 hover:border-slate-300"
                       }`}
                     >
                        <span className={`text-[14px] font-bold mb-1 ${license === lic.id ? 'text-blue-700' : 'text-slate-800'}`}>{lic.name}</span>
                        <span className="text-[12px] text-slate-500 font-medium leading-relaxed">{lic.desc}</span>
                     </button>
                   ))}
                 </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-2">
                 <div
                   onClick={() => setIncludeTests(!includeTests)}
                   className={`cursor-pointer flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                     includeTests
                       ? "bg-blue-50/50 border-blue-600 shadow-sm shadow-blue-100"
                       : "bg-white border-slate-200 hover:border-slate-300"
                   }`}
                 >
                   <div>
                     <div className={`text-[15px] font-bold ${includeTests ? 'text-blue-700' : 'text-slate-800'}`}>Include Testing Directory</div>
                     <div className="text-[13px] text-slate-500 font-medium mt-1">Generate a structured /tests folder with Jest configuration.</div>
                   </div>
                   <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-all shadow-inner ${includeTests ? 'bg-blue-600' : 'bg-slate-200'}`}>
                     <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${includeTests ? 'translate-x-6' : 'translate-x-0'}`} />
                   </div>
                 </div>

                 <div
                   onClick={() => setIncludeReadme(!includeReadme)}
                   className={`cursor-pointer flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                     includeReadme
                       ? "bg-blue-50/50 border-blue-600 shadow-sm shadow-blue-100"
                       : "bg-white border-slate-200 hover:border-slate-300"
                   }`}
                 >
                   <div>
                     <div className={`text-[15px] font-bold ${includeReadme ? 'text-blue-700' : 'text-slate-800'}`}>Generate README.md</div>
                     <div className="text-[13px] text-slate-500 font-medium mt-1">Pre-populate repository instructions.</div>
                   </div>
                   <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-all shadow-inner ${includeReadme ? 'bg-blue-600' : 'bg-slate-200'}`}>
                     <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${includeReadme ? 'translate-x-6' : 'translate-x-0'}`} />
                   </div>
                 </div>
              </div>


            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10 pb-20 w-full">
              <button
                onClick={handleComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold px-10 py-4 rounded-xl transition-all shadow-md flex-1 text-[14px] flex items-center justify-center gap-2"
              >
                Finish & Build Project
              </button>
              <button onClick={() => handleComplete()} className="text-slate-500 sm:w-auto w-full cursor-pointer hover:text-slate-800 font-bold px-8 py-4 rounded-xl transition-all bg-white border-2 border-slate-200 hover:border-slate-300">
                Skip & Finalize
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 py-16 px-4 sm:px-8 flex justify-center selection:bg-blue-200 w-full overflow-x-hidden">
      <div className="w-full max-w-6xl flex items-start mx-auto gap-24 lg:gap-64">
        
        {/* Left Spine Container */}
        <div className="relative shrink-0 w-[200px] sm:w-[280px] hidden md:block">
          {/* Background Track Line */}
          <div className="absolute top-[16px] bottom-6 left-[15px] w-[3px] bg-slate-200 rounded-full" />
          
          {/* Glowing Animated Moving Line */}
          <div
            className="absolute top-[16px] left-[15px] w-[3px] bg-blue-600 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_0_12px_rgba(37,99,235,0.7)]"
            style={{ height: `calc(${(currentStep - 1) / (STEPS.length - 1)} * 100% - 24px)` }}
          />

          {/* Dots and Labels */}
          <div className="relative flex flex-col justify-between h-[650px]">
             {STEPS.map((step) => (
               <div key={step.id} className="relative group cursor-pointer flex items-center" onClick={() => step.id < currentStep && setCurrentStep(step.id)}>
                 {renderDot(step)}
                 <div className={`absolute left-10 sm:left-14 text-[12px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all duration-500 ${step.id === currentStep ? 'text-blue-700 translate-x-1' : step.id < currentStep ? 'text-slate-800' : 'text-slate-400 hover:text-slate-500'}`}>
                    {step.title}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 w-full max-w-[700px] min-h-[600px] relative">
          
          {/* Global Back Link at the top */}
          {currentStep > 1 && (
             <button
                onClick={prevStep}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-[13px] transition-colors"
             >
                <ArrowLeft size={16} /> Back to previous step
             </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Step indicator for mobile inside the form box */}
              <div className="md:hidden mb-4 text-[10px] font-black uppercase tracking-widest text-blue-600">
                Step {currentStep} of {STEPS.length}
              </div>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
