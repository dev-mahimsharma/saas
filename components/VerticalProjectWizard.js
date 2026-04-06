"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowLeft,
  X,
  Plus,
  ChevronDown,
  Box,
  Layers3,
  Orbit,
  AppWindow,
  Sparkles,
  Flame,
  Component,
} from "lucide-react";
import DependencySearchModal from "@/components/dependency-search/DependencySearchModal";
import { getStarterDependencies } from "@/lib/generation/catalog";
import {
  buildWizardDraftFromPreview,
  WIZARD_EDIT_MODE_KEY,
  loadPendingProjectPreview,
  savePendingProjectPreview,
} from "@/lib/projectPreview";

const STEPS = [
  { id: 1, title: "Project Identity" },
  { id: 2, title: "Architecture Stack" },
  { id: 3, title: "Styling Engine" },
  { id: 4, title: "UI Components" },
  { id: 5, title: "Dependencies" },
  { id: 6, title: "Additional" },
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
  { id: "shadcn", name: "Shadcn UI", icon: Box, accent: "from-slate-900 to-slate-700" },
  { id: "mui", name: "Material UI", icon: Layers3, accent: "from-sky-500 to-blue-600" },
  { id: "radix", name: "Radix UI", icon: Orbit, accent: "from-violet-500 to-fuchsia-500" },
  { id: "ant", name: "Ant Design", icon: AppWindow, accent: "from-cyan-500 to-blue-500" },
  { id: "chakra", name: "Chakra UI", icon: Box, accent: "from-cyan-600 to-teal-500" },
  { id: "nextui", name: "NextUI", icon: Sparkles, accent: "from-emerald-500 to-teal-500" },
  { id: "mantine", name: "Mantine", icon: Flame, accent: "from-orange-500 to-amber-500" },
  { id: "headless", name: "Headless UI", icon: Component, accent: "from-rose-500 to-pink-500" },
];

const LICENSES = [
  { id: "mit", name: "MIT License", desc: "A short and completely permissive." },
  { id: "apache", name: "Apache 2.0", desc: "Permissive with patent rights." },
  { id: "gpl3", name: "GNU GPLv3", desc: "Strong copyleft requirement." },
  { id: "bsd3", name: "BSD 3-Clause", desc: "Permissive with minimal restrictions." },
  { id: "none", name: "No License", desc: "All rights reserved (Closed)." },
];

const WIZARD_STORAGE_KEY = "wizard_state_v2";
const WIZARD_RELOAD_FLAG = "wizard_state_v2_reload";
const DEFAULT_WIZARD_STATE = {
  projectName: "",
  language: "ts",
  stack: "",
  styling: "",
  uiLib: "",
  dependencies: { frontend: [], backend: [] },
  dependencyTarget: "frontend",
  currentStep: 1,
  license: "mit",
  includeTests: false,
  includeReadme: true,
  readmeContent: "",
};

const STACK_DEPENDENCY_TARGETS = {
  next: {
    ts: [{ id: "frontend", label: "src" }],
    js: [{ id: "frontend", label: "src" }],
  },
  mern: {
    ts: [
      { id: "frontend", label: "client" },
      { id: "backend", label: "server" },
    ],
    js: [
      { id: "frontend", label: "client" },
      { id: "backend", label: "server" },
    ],
  },
  django: {
    ts: [
      { id: "frontend", label: "client" },
      { id: "backend", label: "server" },
    ],
    js: [
      { id: "frontend", label: "client" },
      { id: "backend", label: "server" },
    ],
  },
  vanilla: {
    ts: [{ id: "frontend", label: "src" }],
    js: [{ id: "frontend", label: "assets" }],
  },
};

function normalizeDependencyEntry(entry, source = "user") {
  if (!entry) return null;

  if (typeof entry === "string") {
    const name = entry.trim();
    return name
      ? {
          name,
          version: "latest",
          manager: "npm",
          section: "dependencies",
          source,
          locked: source === "starter",
        }
      : null;
  }

  if (typeof entry?.name !== "string" || !entry.name.trim()) {
    return null;
  }

  return {
    name: entry.name.trim(),
    version: typeof entry.version === "string" && entry.version.trim() ? entry.version.trim() : "latest",
    manager: typeof entry.manager === "string" ? entry.manager : "npm",
    section: typeof entry.section === "string" ? entry.section : "dependencies",
    source: entry.source || source,
    locked: entry.locked ?? source === "starter",
  };
}

function buildStarterDependencyState(stack, language) {
  const starter = getStarterDependencies(stack, language);

  return {
    frontend: starter.frontend.map((entry) => normalizeDependencyEntry(entry, "starter")).filter(Boolean),
    backend: starter.backend.map((entry) => normalizeDependencyEntry(entry, "starter")).filter(Boolean),
  };
}

function mergeDependencyBucket(starterEntries, currentEntries = []) {
  const merged = [];
  const seen = new Set();

  for (const entry of starterEntries) {
    const key = entry.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(entry);
    }
  }

  for (const rawEntry of currentEntries) {
    const entry = normalizeDependencyEntry(rawEntry, rawEntry?.source || "user");
    if (!entry || entry.source === "starter") {
      continue;
    }

    const key = entry.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push({ ...entry, source: "user", locked: false });
    }
  }

  return merged;
}

function mergeStarterDependencies(previousDependencies, stack, language) {
  const starter = buildStarterDependencyState(stack, language);

  return {
    frontend: mergeDependencyBucket(starter.frontend, previousDependencies?.frontend),
    backend: mergeDependencyBucket(starter.backend, previousDependencies?.backend),
  };
}

function formatDependencyVersion(version) {
  if (typeof version !== "string" || !version.trim()) {
    return "latest";
  }

  return version.trim().replace(/^[~^]+/, "");
}

function parseWizardState(saved) {
  if (!saved) {
    return DEFAULT_WIZARD_STATE;
  }

  try {
    const parsed = JSON.parse(saved);

    return {
      projectName: parsed?.projectName || "",
      language: parsed?.language || "ts",
      stack: parsed?.stack || "",
      styling: parsed?.styling ?? "",
      uiLib: parsed?.uiLib ?? "",
      dependencies: Array.isArray(parsed?.dependencies)
        ? {
            frontend: parsed.dependencies
              .map((entry) => normalizeDependencyEntry(entry, "user"))
              .filter(Boolean),
            backend: [],
          }
        : {
            frontend: Array.isArray(parsed?.dependencies?.frontend)
              ? parsed.dependencies.frontend
                  .map((entry) => normalizeDependencyEntry(entry, entry?.source || "user"))
                  .filter(Boolean)
              : [],
            backend: Array.isArray(parsed?.dependencies?.backend)
              ? parsed.dependencies.backend
                  .map((entry) => normalizeDependencyEntry(entry, entry?.source || "user"))
                  .filter(Boolean)
              : [],
          },
      dependencyTarget: parsed?.dependencyTarget || "frontend",
      currentStep: parsed?.currentStep || 1,
      license: parsed?.license || "mit",
      includeTests: parsed?.includeTests ?? false,
      includeReadme: parsed?.includeReadme ?? true,
      readmeContent: parsed?.readmeContent ?? "",
    };
  } catch {
    return DEFAULT_WIZARD_STATE;
  }
}

function readInitialWizardSession() {
  if (typeof window === "undefined") {
    return {
      state: DEFAULT_WIZARD_STATE,
      editModeEnabled: false,
    };
  }

  const shouldRestore = sessionStorage.getItem(WIZARD_RELOAD_FLAG) === "true";
  const shouldEnableEditMode = sessionStorage.getItem(WIZARD_EDIT_MODE_KEY) === "true";
  const pendingPreview = shouldEnableEditMode ? loadPendingProjectPreview() : null;
  const saved = shouldRestore ? sessionStorage.getItem(WIZARD_STORAGE_KEY) : null;

  return {
    state:
      shouldEnableEditMode && pendingPreview
        ? buildWizardDraftFromPreview(pendingPreview)
        : parseWizardState(saved),
    editModeEnabled: shouldEnableEditMode,
  };
}

export default function VerticalProjectWizard() {
  const initialSession = readInitialWizardSession();
  const initialWizardState = initialSession.state;
  const initialEditModeEnabled = initialSession.editModeEnabled;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(initialWizardState.currentStep);
  const [editModeEnabled, setEditModeEnabled] = useState(initialEditModeEnabled);
  const editModeRef = useRef(false);

  // States
  const [projectName, setProjectName] = useState(initialWizardState.projectName);
  const [language, setLanguage] = useState(initialWizardState.language);
  const [stack, setStack] = useState(initialWizardState.stack);
  const [styling, setStyling] = useState(initialWizardState.styling);
  const [uiLib, setUiLib] = useState(initialWizardState.uiLib);
  const [dependencyModalOpen, setDependencyModalOpen] = useState(false);
  const [dependencyTarget, setDependencyTarget] = useState(initialWizardState.dependencyTarget);
  const [dependencyMenuOpen, setDependencyMenuOpen] = useState(false);
  const [dependencies, setDependencies] = useState(initialWizardState.dependencies);
  const dependencyMenuRef = useRef(null);

  // Step 6 States
  const [license, setLicense] = useState(initialWizardState.license);
  const [includeTests, setIncludeTests] = useState(initialWizardState.includeTests);
  const [includeReadme, setIncludeReadme] = useState(initialWizardState.includeReadme);
  const [readmeContent, setReadmeContent] = useState(initialWizardState.readmeContent);

  useEffect(() => {
    const shouldRestore = sessionStorage.getItem(WIZARD_RELOAD_FLAG) === "true";

    if (shouldRestore) {
      sessionStorage.removeItem(WIZARD_RELOAD_FLAG);
    } else {
      sessionStorage.removeItem(WIZARD_STORAGE_KEY);
    }
    sessionStorage.removeItem(WIZARD_EDIT_MODE_KEY);

    editModeRef.current = initialEditModeEnabled;
    setMounted(true);
  }, []);

  useEffect(() => {
    editModeRef.current = editModeEnabled;
  }, [editModeEnabled]);

  useEffect(() => {
    if (!mounted) return;
    sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify({
      projectName, language, stack, styling, uiLib, dependencies, dependencyTarget, currentStep,
      license, includeTests, includeReadme, readmeContent
    }));
  }, [projectName, language, stack, styling, uiLib, dependencies, dependencyTarget, currentStep, license, includeTests, includeReadme, readmeContent, mounted]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(WIZARD_RELOAD_FLAG, "true");
      if (editModeRef.current) {
        sessionStorage.setItem(WIZARD_EDIT_MODE_KEY, "true");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (sessionStorage.getItem(WIZARD_RELOAD_FLAG) !== "true") {
        sessionStorage.removeItem(WIZARD_STORAGE_KEY);
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!dependencyMenuRef.current?.contains(event.target)) {
        setDependencyMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setDependencyMenuOpen(false);
        setDependencyModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (stack === "vanilla" && includeTests) {
      setIncludeTests(false);
    }
  }, [stack, includeTests]);

  useEffect(() => {
    if (!mounted || !stack) return;
    setDependencies((prev) => mergeStarterDependencies(prev, stack, language));
  }, [stack, language, mounted]);

  useEffect(() => {
    if (uiLib === "shadcn" && styling !== "tailwind") {
      setUiLib("");
    }
  }, [styling, uiLib]);

  useEffect(() => {
    const availableTargets = STACK_DEPENDENCY_TARGETS[stack]?.[language] || [];
    if (!availableTargets.length) return;

    if (!availableTargets.some((target) => target.id === dependencyTarget)) {
      setDependencyTarget(availableTargets[0].id);
    }
  }, [stack, language, dependencyTarget]);

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep((prev) => prev + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = (overrides = {}) => {
    const safeOverrides =
      overrides &&
      typeof overrides === "object" &&
      !("nativeEvent" in overrides) &&
      !("preventDefault" in overrides)
        ? overrides
        : {};

    savePendingProjectPreview({
        projectName: projectName || "my-app",
        language,
        stack,
        styling,
        uiLib,
        license,
        includeTests,
        includeReadme,
        readmeContent,
        dependencies: {
          frontend: dependencies.frontend,
          backend: dependencies.backend,
        },
        dependencyTarget,
        ...safeOverrides,
      });

    router.push("/project-preview");
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

  const dependencyTargets = STACK_DEPENDENCY_TARGETS[stack]?.[language] || [];
  const selectedDependencyTarget = dependencyTargets.find((target) => target.id === dependencyTarget) || dependencyTargets[0];

  const removeDependency = (targetId, dependency) => {
    if (dependency?.locked) {
      return;
    }

    setDependencies((prev) => ({
      ...prev,
      [targetId]: prev[targetId].filter((item) => item.name !== dependency.name),
    }));
  };

  const resolveDependencyBucket = (target) => {
    const normalizedId = target?.id?.toLowerCase() || "";
    const normalizedLabel = target?.label?.toLowerCase() || "";

    if (normalizedId === "backend" || normalizedLabel === "backend" || normalizedLabel === "server") {
      return "backend";
    }

    return "frontend";
  };

  const addDependencyToTarget = (packageResult) => {
    const dependency = normalizeDependencyEntry(packageResult, "user");

    if (!dependency?.name) {
      return;
    }

    const activeTarget =
      dependencyTargets.find((target) => target.id === dependencyTarget) ||
      selectedDependencyTarget;
    const bucket = resolveDependencyBucket(activeTarget);

    setDependencies((prev) => {
      if (prev[bucket].some((item) => item.name.toLowerCase() === dependency.name.toLowerCase())) {
        return prev;
      }

      return {
        ...prev,
        [bucket]: [...prev[bucket], dependency],
      };
    });

    setDependencyModalOpen(false);
  };

  const userAddedDependenciesCount =
    dependencies.frontend.filter((dependency) => dependency.source === "user").length +
    dependencies.backend.filter((dependency) => dependency.source === "user").length;

  const continueButtonClass =
    "inline-flex h-[56px] w-full sm:w-[220px] items-center justify-center rounded-xl bg-blue-600 px-10 py-4 font-bold text-white shadow-md transition-all hover:bg-blue-700";
  const skipButtonClass =
    "inline-flex h-[56px] w-full sm:w-[160px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-500 transition-all hover:text-slate-800";

  const renderContinueButton = (
    disabled,
    onClick = nextStep,
    disabledMessage = "Cannot continue further with empty field"
  ) => {
    if (!disabled) {
      return (
        <button
          onClick={onClick}
          className={`${continueButtonClass} cursor-pointer`}
        >
          Continue
        </button>
      );
    }

    return (
      <div className="relative group w-full sm:w-[220px]">
        <button
          disabled
          className="inline-flex h-[56px] w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-4 font-bold text-white opacity-50 shadow-md transition-all cursor-not-allowed"
        >
          Continue
        </button>
        <div className="absolute top-full left-1/2 z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg group-hover:block">
          {disabledMessage}
        </div>
      </div>
    );
  };

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
              
              <div className="pt-6 flex flex-col gap-4 sm:flex-row">
                {renderContinueButton(!projectName.trim())}
                <div className="relative group">
                  <button disabled className="inline-flex h-[56px] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-8 py-4 font-bold text-slate-400 cursor-not-allowed sm:w-[160px]">
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
            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              {renderContinueButton(!stack)}
              <div className="relative group">
                <button disabled className="inline-flex h-[56px] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-8 py-4 font-bold text-slate-400 cursor-not-allowed sm:w-[160px]">
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
            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              {renderContinueButton(!styling)}
              <button onClick={() => { setStyling(""); nextStep(); }} className={`${skipButtonClass} cursor-pointer`}>
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
                (() => {
                  const Icon = lib.icon;
                  const isDisabled = lib.id === "shadcn" && styling !== "tailwind";

                  return (
                    <div key={lib.id} className="group relative">
                      <button
                        onClick={() => {
                          if (!isDisabled) {
                            setUiLib(lib.id);
                          }
                        }}
                        disabled={isDisabled}
                        className={`flex w-full flex-col items-center justify-center p-5 rounded-xl border-2 transition-all text-center ${
                          isDisabled
                            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                            : uiLib === lib.id
                              ? "cursor-pointer bg-blue-50/50 border-blue-600 text-blue-700 shadow-sm shadow-blue-100"
                              : "cursor-pointer bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        <div
                          className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${lib.accent} ${
                            uiLib === lib.id && !isDisabled ? "text-white shadow-lg shadow-blue-200/60" : "text-white shadow-md"
                          } ${isDisabled ? "opacity-55" : ""}`}
                        >
                          <Icon size={22} strokeWidth={2.2} />
                        </div>
                        <span className="font-bold text-[13px]">{lib.name}</span>
                      </button>
                      {isDisabled ? (
                        <div className="pointer-events-none absolute -top-12 left-1/2 z-10 hidden w-56 -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-semibold leading-relaxed text-white shadow-xl group-hover:block">
                          Cannot use Shadcn UI without Tailwind CSS in this starter.
                        </div>
                      ) : null}
                    </div>
                  );
                })()
              ))}
            </div>
            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              {renderContinueButton(!uiLib)}
              <button onClick={() => { setUiLib(""); nextStep(); }} className={`${skipButtonClass} cursor-pointer`}>
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
               <p className="text-slate-500 text-[14px] mt-1 mb-6">Inject project packages securely before the generator runs.</p>
            </div>
            <div className="w-full border-l border-slate-200 pl-6 sm:pl-7">
              <div className="space-y-4 relative mt-2">
                <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-4 items-end">
                  <div className="w-full">
                     <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Install Into</label>
                     <div className="relative" ref={dependencyMenuRef}>
                       <button
                         type="button"
                         onClick={() => setDependencyMenuOpen((open) => !open)}
                         className="flex h-[60px] w-full cursor-pointer items-center justify-between rounded-xl border-2 border-slate-200 bg-white px-5 text-left text-slate-800 shadow-sm transition-all hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                       >
                         <div className="min-w-0">
                           <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Folder</div>
                           <div className="mt-1 truncate text-[15px] font-bold text-slate-900">
                             {selectedDependencyTarget?.label || "Select folder"}
                           </div>
                         </div>
                         <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all ${dependencyMenuOpen ? "rotate-180 bg-blue-50 text-blue-600" : ""}`}>
                           <ChevronDown size={18} />
                         </div>
                       </button>

                       <AnimatePresence>
                         {dependencyMenuOpen && (
                           <motion.div
                             initial={{ opacity: 0, y: 10, scale: 0.96 }}
                             animate={{ opacity: 1, y: 0, scale: 1 }}
                             exit={{ opacity: 0, y: 6, scale: 0.96 }}
                             transition={{ duration: 0.15, ease: "easeOut" }}
                             className="absolute left-0 right-0 z-20 mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md"
                           >
                             <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                               <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Choose target folder</p>
                             </div>
                             <div className="p-2">
                               {dependencyTargets.map((target) => {
                                 const isActive = target.id === dependencyTarget;

                                 return (
                                    <button
                                      key={target.id}
                                      type="button"
                                      onClick={() => {
                                        setDependencyTarget(target.id);
                                        setDependencyMenuOpen(false);
                                      }}
                                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                                        isActive
                                          ? "bg-blue-50 text-blue-700"
                                          : "text-slate-700 hover:bg-slate-50"
                                      }`}
                                    >
                                     <div>
                                       <p className="text-[14px] font-bold">{target.label}</p>
                                       <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                                         {target.id === "frontend" ? "Frontend folder" : "Backend folder"}
                                       </p>
                                     </div>
                                     {isActive ? (
                                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                                         <Check size={15} strokeWidth={3} />
                                       </div>
                                     ) : null}
                                   </button>
                                 );
                               })}
                             </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                  </div>
                  <div className="w-full">
                     <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Add Dependency</label>
                     <button
                       type="button"
                       onClick={() => setDependencyModalOpen(true)}
                       className="flex h-[60px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-[15px] font-bold text-white shadow-sm transition-all hover:bg-slate-950
                       hover:cursor-pointer hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/10"
                     >
                       <Plus size={18} />
                       Add Dependency
                     </button>
                  </div>
                </div>
              </div>

              {/* Dependencies Grid */}
              <div className="mt-8 w-full bg-slate-50/50 p-6 sm:p-7 min-h-[160px]">
                 <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-4">Required Injectables</div>
                 <div className="space-y-6 pb-2">
                   {dependencyTargets.map((target, index) => (
                     <div key={target.id}>
                       {index > 0 ? <div className="mb-6 border-t border-slate-200" /> : null}
                       <div className="flex items-center justify-between mb-3">
                         <h3 className="text-[12px] font-black uppercase tracking-[0.12em] text-slate-700">
                           {target.label}
                         </h3>
                         <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                           {dependencies[target.id].length} package{dependencies[target.id].length === 1 ? "" : "s"}
                         </span>
                       </div>
                       {dependencies[target.id].length === 0 ? (
                         <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-[13px] font-medium italic text-slate-400">
                           No dependencies added in {target.label} yet.
                         </div>
                       ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                           {dependencies[target.id].map((dep) => (
                             <div
                               key={`${target.id}-${dep.name}`}
                               className={`group flex min-h-[92px] items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm ${
                                 dep.source === "starter"
                                   ? target.id === "frontend"
                                     ? "border-blue-200 bg-blue-50/70"
                                     : "border-emerald-200 bg-emerald-50/70"
                                   : "border-slate-200 bg-white"
                               }`}
                             >
                               <div className="min-w-0">
                                 <div className="truncate text-[14px] font-bold text-slate-800">{dep.name}</div>
                                 <div className="mt-1 text-[12px] font-semibold text-slate-500">
                                   Version: {formatDependencyVersion(dep.version)}
                                 </div>
                                 <div className="mt-1 flex flex-wrap items-center gap-2">
                                   <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                                     dep.source === "starter"
                                       ? target.id === "frontend"
                                         ? "bg-blue-100 text-blue-700"
                                         : "bg-emerald-100 text-emerald-700"
                                       : "bg-slate-100 text-slate-600"
                                   }`}>
                                     {dep.source === "starter" ? "Starter Pack" : "Custom"}
                                   </span>
                                   <span className="text-[11px] font-medium text-slate-500">
                                     {dep.manager === "python" ? "PyPI" : dep.section === "devDependencies" ? "Dev dependency" : "Dependency"}
                                   </span>
                                 </div>
                               </div>
                               <div className="relative shrink-0">
                                 <button
                                   type="button"
                                   onClick={() => removeDependency(target.id, dep)}
                                   disabled={dep.locked}
                                   className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                                     dep.locked
                                       ? "cursor-not-allowed bg-white/80 text-slate-300"
                                       : "cursor-pointer bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                   }`}
                                 >
                                   <X size={15} />
                                 </button>
                                 {dep.locked ? (
                                   <div className="pointer-events-none absolute -top-12 right-0 hidden w-56 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-semibold leading-relaxed text-white shadow-xl group-hover:block">
                                     This dependency is part of the starter pack and cannot be removed.
                                   </div>
                                 ) : null}
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-stretch gap-4 pt-6 pb-4 sm:flex-row">
              {renderContinueButton(
                userAddedDependenciesCount === 0,
                nextStep,
                "You must add a dependency to continue."
              )}
              <button onClick={() => { setDependencies(buildStarterDependencyState(stack, language)); nextStep(); }} className={`${skipButtonClass} cursor-pointer`}>
                Skip
              </button>
            </div>

            <DependencySearchModal
              isOpen={dependencyModalOpen}
              onClose={() => setDependencyModalOpen(false)}
              onSelect={addDependencyToTarget}
              selectedTargetLabel={selectedDependencyTarget?.label}
            />
          </div>
        );
      case 6:
        return (
            <div className="space-y-8 mt-2">
              <div>
               <h2 className="text-[28px] font-black text-slate-900 tracking-tight">Additional</h2>
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
                 <div className="relative group">
                   <div
                     onClick={() => {
                       if (stack !== "vanilla") {
                         setIncludeTests(!includeTests);
                       }
                     }}
                     className={`cursor-pointer flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                       includeTests
                         ? "bg-blue-50/50 border-blue-600 shadow-sm shadow-blue-100"
                         : stack === "vanilla"
                           ? "bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed"
                           : "bg-white border-slate-200 hover:border-slate-300"
                     }`}
                   >
                     <div>
                       <div className={`text-[15px] font-bold ${includeTests ? 'text-blue-700' : 'text-slate-800'}`}>Include Testing Directory</div>
                       <div className="text-[13px] text-slate-500 font-medium mt-1">
                         {stack === "vanilla"
                           ? "Testing scaffolds are disabled for Vanilla JS templates."
                           : "Generate a structured /tests folder with Jest configuration."}
                       </div>
                     </div>
                     <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-all shadow-inner ${includeTests ? 'bg-blue-600' : 'bg-slate-200'}`}>
                       <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${includeTests ? 'translate-x-6' : 'translate-x-0'}`} />
                     </div>
                   </div>
                   {stack === "vanilla" ? (
                     <div className="absolute top-full left-1/2 z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg group-hover:block">
                       Test folder cannot be added in basic vanilla starter
                     </div>
                   ) : null}
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

            <div className="flex w-full flex-col gap-4 pt-10 pb-20 sm:flex-row">
              <button
                onClick={handleComplete}
                className="flex h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-10 py-4 text-[14px] font-bold text-white shadow-md transition-all hover:bg-blue-700 sm:flex-1"
              >
                Finish & Build Project
              </button>
              <button
                onClick={() =>
                  handleComplete({
                    license: DEFAULT_WIZARD_STATE.license,
                    includeTests: DEFAULT_WIZARD_STATE.includeTests,
                    includeReadme: DEFAULT_WIZARD_STATE.includeReadme,
                    readmeContent: DEFAULT_WIZARD_STATE.readmeContent,
                  })
                }
                className="inline-flex h-[56px] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-8 py-4 font-bold text-slate-500 transition-all hover:border-slate-300 hover:text-slate-800 sm:w-auto sm:min-w-[190px]"
              >
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
               <div
                 key={step.id}
                 className={`relative flex items-center ${editModeEnabled ? "group cursor-pointer" : "cursor-default"}`}
                 onClick={() => {
                   if (editModeEnabled) {
                     setCurrentStep(step.id);
                   }
                 }}
               >
                 {renderDot(step)}
                 <div className={`absolute left-10 sm:left-14 text-[12px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all duration-500 ${step.id === currentStep ? 'text-blue-700 translate-x-1' : step.id < currentStep ? 'text-slate-800' : editModeEnabled ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-400'}`}>
                    {step.title}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 w-full max-w-[840px] min-h-[600px] relative">
          
          {/* Global Back Link at the top */}
          {currentStep > 1 && (
             <button
                onClick={prevStep}
                className="mb-8 flex cursor-pointer items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-[13px] transition-colors"
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
