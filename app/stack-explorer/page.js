"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BlueprintPreview from "@/components/BlueprintPreview";
import FrameworkCard from "@/components/FrameworkCard";
import { getStructureTree } from "@/data/structureTrees";
import { generateProject } from "@/lib/downloadZip";
import { safeProjectName } from "@/lib/safeProjectName";

const STACKS = [
  { id: "html", title: "Basic HTML", description: "Static site, ES modules" },
  { id: "react", title: "React", description: "Vite + React SPA" },
  { id: "vue", title: "Vue", description: "Vite + Vue 3" },
  { id: "next", title: "Next.js", description: "App Router + Tailwind" },
  { id: "mern", title: "MERN", description: "React client + Express API" },
  { id: "svelte", title: "Svelte", description: "Svelte 4 + Vite" },
  { id: "astro", title: "Astro", description: "Content-focused static site" },
  { id: "api", title: "REST API", description: "Express-only backend" },
];

function IconHtml() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[10px] font-black text-blue-700">
      HTML
    </span>
  );
}

function IconReact() {
  return (
    <svg className="h-8 w-8 text-sky-500" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1" fill="none" transform="translate(12 12)">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function IconVue() {
  return (
    <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78L24 1.61zM12 14.08L5.16 2.97h3.75L12 9.19l3.09-6.22h3.75L12 14.08z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.107-.055.128-.069.115-.108-.01-.031-1.056-1.406-2.34-3.06L18.45 14.1l-.097-.128-.097-.128-1.78-2.312-1.78-2.313-1.04-1.35c-.572-.743-1.042-1.353-1.046-1.353-.004-.001-.007.562-.007 1.25v1.248H12.75V8.25h-1.5V6h2.844c1.564 0 2.844-.002 2.844-.004 0-.003-2.07-2.702-4.6-5.996L12.53 0h-.958z" />
    </svg>
  );
}

function IconMern() {
  return (
    <svg className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 12l9.75-4.5m-9.75 9l4.179 2.25L21.75 12l-4.179-2.25" />
    </svg>
  );
}

function IconSvelte() {
  return (
    <svg className="h-8 w-8 text-orange-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10.354 21.125a8.6 8.6 0 01-5.44-1.855 7.49 7.49 0 01-1.737-1.818 6.81 6.81 0 01-.951-2.05A6.3 6.3 0 012 12c0-.938.18-1.854.526-2.702a6.81 6.81 0 01.951-2.05 7.49 7.49 0 011.737-1.818L12 2l8.785 5.43a7.49 7.49 0 011.737 1.818 6.81 6.81 0 01.951 2.05A6.3 6.3 0 0122 12c0 .938-.18 1.854-.526 2.702a6.81 6.81 0 01-.951 2.05 7.49 7.49 0 01-1.737 1.818L12 22l-1.646-1.018v-4.857H10.354v4.857z" />
    </svg>
  );
}

function IconAstro() {
  return (
    <svg className="h-8 w-8 text-violet-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5 9.5 9.75 12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
    </svg>
  );
}

function IconApi() {
  return (
    <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V6a3 3 0 013-3h13.5a3 3 0 013 3v5.25a3 3 0 01-3 3m-16.5 0h16.5m-16.5 0v1.5a3 3 0 003 3h10.5a3 3 0 003-3v-1.5" />
    </svg>
  );
}

const icons = {
  html: <IconHtml />,
  react: <IconReact />,
  vue: <IconVue />,
  next: <IconNext />,
  mern: <IconMern />,
  svelte: <IconSvelte />,
  astro: <IconAstro />,
  api: <IconApi />,
};

export default function StackExplorerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const [selectedStack, setSelectedStack] = useState("next");
  const [projectNameInput, setProjectNameInput] = useState("my-project");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const rootName = useMemo(
    () => safeProjectName(projectNameInput),
    [projectNameInput]
  );
  const treeNodes = getStructureTree(selectedStack);

  const zipLabel = useMemo(() => {
    const map = {
      html: "~4 KB",
      react: "~18 KB",
      vue: "~20 KB",
      next: "~28 KB",
      mern: "~28 KB",
      svelte: "~16 KB",
      astro: "~12 KB",
      api: "~8 KB",
    };
    return map[selectedStack] ?? "~zip";
  }, [selectedStack]);

  async function handleGenerate() {
    if (status !== "authenticated") {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/stack-explorer")}`);
      return;
    }

    setError("");
    setBusy(true);
    try {
      const { sizeKb, projectRoot, filename } = await generateProject({
        stack: selectedStack,
        projectName: projectNameInput,
        returnTo: pathname || "/stack-explorer",
      });
      const q = new URLSearchParams({
        project: projectRoot,
        size: sizeKb,
        stack: selectedStack,
        file: filename,
      });
      router.push(`/success?${q.toString()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex-1">
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
              v2.0
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Architect Mode
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-500">
            Pick a stack, set the project name, explore the file tree (click files
            for boilerplate previews), then download{" "}
            <span className="font-semibold text-slate-700">{rootName}.zip</span>.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
          <div className="space-y-8">
            <section>
              <label
                htmlFor="arch-project"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Project name
              </label>
              <input
                id="arch-project"
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                className="mt-2 w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none ring-blue-500/20 focus:ring-4"
                placeholder="my-project"
              />
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                01 — Frontend / stack
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {STACKS.map((s) => (
                  <FrameworkCard
                    key={s.id}
                    title={s.title}
                    description={s.description}
                    selected={selectedStack === s.id}
                    onClick={() => setSelectedStack(s.id)}
                    icon={icons[s.id]}
                    checkPosition="top"
                  />
                ))}
              </div>
            </section>

            {error ? (
              <p className="text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <BlueprintPreview
            rootName={rootName}
            treeNodes={treeNodes}
            zipLabel={zipLabel}
            action={
              <button
                type="button"
                disabled={busy || status === "loading"}
                onClick={handleGenerate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {status === "loading"
                  ? "Checking session..."
                  : busy
                    ? "Zipping…"
                    : "Generate & Download Project"}
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
