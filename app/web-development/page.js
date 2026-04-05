"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import FrameworkCard from "@/components/FrameworkCard";
import LiveStructurePreview from "@/components/LiveStructurePreview";
import { getStructureTree } from "@/data/structureTrees";
import { generateProject } from "@/lib/downloadZip";
import { safeProjectName } from "@/lib/safeProjectName";

const PRESETS = [
  {
    id: "next",
    stack: "next",
    title: "Next.js App",
    description: "App Router, Tailwind, layout shell",
  },
  {
    id: "react",
    stack: "react",
    title: "React + Vite",
    description: "SPA with components & hooks",
  },
  {
    id: "html",
    stack: "html",
    title: "Basic HTML",
    description: "ES modules, css/ & js/ layout",
  },
  {
    id: "mern",
    stack: "mern",
    title: "MERN Stack",
    description: "Vite client + Express API",
  },
];

function IconStack() {
  return (
    <svg className="h-8 w-8 text-slate-800" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.107-.055.128-.069.115-.108-.01-.031-1.056-1.406-2.34-3.06L18.45 14.1l-.097-.128-.097-.128-1.78-2.312-1.78-2.313-1.04-1.35c-.572-.743-1.042-1.353-1.046-1.353-.004-.001-.007.562-.007 1.25v1.248H12.75V8.25h-1.5V6h2.844c1.564 0 2.844-.002 2.844-.004 0-.003-2.07-2.702-4.6-5.996L12.53 0h-.958z" />
    </svg>
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

function IconHtml() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-xs font-black text-blue-700">
      HTML
    </span>
  );
}

function IconMern() {
  return (
    <svg className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 12l9.75-4.5m-9.75 9l4.179 2.25L21.75 12l-4.179-2.25" />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [presetId, setPresetId] = useState("next");
  const [projectNameInput, setProjectNameInput] = useState("my-awesome-app");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selected = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const rootName = useMemo(
    () => safeProjectName(projectNameInput),
    [projectNameInput]
  );
  const treeNodes = getStructureTree(selected.stack);

  const bundleLabel = useMemo(() => {
    const map = {
      html: "~4 KB",
      react: "~18 KB",
      next: "~28 KB",
      mern: "~28 KB",
    };
    return map[selected.stack] ?? "~zip";
  }, [selected.stack]);

  async function handleCreate() {
    setError("");
    setBusy(true);
    try {
      const { sizeKb, projectRoot, filename } = await generateProject({
        stack: selected.stack,
        projectName: projectNameInput,
      });
      const q = new URLSearchParams({
        project: projectRoot,
        size: sizeKb,
        stack: selected.stack,
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
    next: <IconStack />,
    react: <IconReact />,
    html: <IconHtml />,
    mern: <IconMern />,
  };

  return (
    <div className="flex-1">
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Let&apos;s Build Your Project
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            Choose a preset, name your project, explore the tree, then download a
            complete starter.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
          <Card className="flex-1 p-6 shadow-md sm:p-8">
            <div className="space-y-8">
              <div>
                <label
                  htmlFor="project-name"
                  className="text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Project name
                </label>
                <input
                  id="project-name"
                  value={projectNameInput}
                  onChange={(e) => setProjectNameInput(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none ring-blue-500/30 transition focus:border-blue-500 focus:bg-white focus:ring-4"
                  placeholder="my-awesome-app"
                  autoComplete="off"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Zip:{" "}
                  <span className="font-mono font-semibold text-slate-700">
                    {rootName}.zip
                  </span>{" "}
                  · Root folder:{" "}
                  <span className="font-mono font-semibold text-slate-700">
                    {rootName}/
                  </span>
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter presets
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {PRESETS.map((p) => (
                    <FrameworkCard
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

              <p className="text-xs text-slate-500">
                Click files in the preview to see sample boilerplate. Folders expand
                and collapse.
              </p>

              {error ? (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="button"
                disabled={busy}
                onClick={handleCreate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {busy ? "Preparing archive…" : "Create & Download Project"}
              </button>
            </div>
          </Card>

          <div className="lg:w-[440px] shrink-0 font-sans sticky top-28">
            <LiveStructurePreview
              rootName={rootName}
              treeNodes={treeNodes}
              bundleLabel={bundleLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
