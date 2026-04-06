"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FolderTreePreview from "@/components/FolderTreePreview";
import { generateProject } from "@/lib/downloadZip";
import {
  clearPendingProjectPreview,
  getProjectPreviewBundleLabel,
  getProjectPreviewRootName,
  getProjectPreviewTree,
  saveLastGeneratedProject,
  loadPendingProjectPreview,
  restoreWizardDraft,
} from "@/lib/projectPreview";

function formatStackLabel(value) {
  const labels = {
    next: "Next.js",
    mern: "MERN Stack",
    django: "Django + React",
    vanilla: "Vanilla HTML/JS",
  };

  return labels[value] || value || "Not selected";
}

function formatLanguageLabel(value) {
  return value === "ts" ? "TypeScript" : value === "js" ? "JavaScript" : "Not selected";
}

function formatToggleLabel(value, enabledLabel, disabledLabel) {
  return value ? enabledLabel : disabledLabel;
}

export default function ProjectPreviewView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [config, setConfig] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const hasAutoStarted = useRef(false);

  useEffect(() => {
    const pendingConfig = loadPendingProjectPreview();

    if (!pendingConfig) {
      router.replace("/stack-explorer");
      return;
    }

    setConfig(pendingConfig);
  }, [router]);

  const rootName = useMemo(
    () => getProjectPreviewRootName(config?.projectName),
    [config?.projectName]
  );
  const treeNodes = useMemo(
    () => (config ? getProjectPreviewTree(config) : []),
    [config]
  );
  const bundleLabel = useMemo(
    () => getProjectPreviewBundleLabel(config || {}),
    [config]
  );
  const dependencyCount = useMemo(() => {
    const frontend = config?.dependencies?.frontend?.length || 0;
    const backend = config?.dependencies?.backend?.length || 0;
    return frontend + backend;
  }, [config]);

  function handleEdit() {
    restoreWizardDraft(config);
    router.push("/stack-explorer");
  }

  const handleDownload = useCallback(async () => {
    if (!config || busy) {
      return;
    }

    setError("");
    setBusy(true);

    try {
      const { sizeKb, projectRoot, filename } = await generateProject({
        projectName: config.projectName || "my-app",
        category: "web-dev",
        language: config.language || "ts",
        stack: config.stack,
        styling: config.styling,
        uiLibrary: config.uiLib,
        selectedLicense: config.license,
        includeTests: config.includeTests,
        includeReadme: config.includeReadme,
        readmeContent: config.readmeContent,
        clientDeps: config.dependencies?.frontend?.filter(
          (dependency) => dependency.source !== "starter"
        ),
        serverDeps: config.dependencies?.backend?.filter(
          (dependency) => dependency.source !== "starter"
        ),
        returnTo: `${pathname}?autoDownload=true`,
      });

      saveLastGeneratedProject({
        projectName: config.projectName || "my-app",
        category: "web-dev",
        language: config.language || "ts",
        stack: config.stack,
        styling: config.styling,
        uiLib: config.uiLib,
        license: config.license,
        includeTests: config.includeTests,
        includeReadme: config.includeReadme,
        readmeContent: config.readmeContent,
        dependencies: {
          frontend: config.dependencies?.frontend || [],
          backend: config.dependencies?.backend || [],
        },
      });

      clearPendingProjectPreview();

      const q = new URLSearchParams({
        project: projectRoot,
        size: sizeKb,
        stack: config.stack || "next",
        file: filename,
        lang: config.language || "ts",
        styling: config.styling || "",
        ui: config.uiLib || "",
        tests: config.includeTests ? "1" : "0",
        readme: config.includeReadme ? "1" : "0",
        fdeps: String(
          config.dependencies?.frontend?.filter(
            (dependency) => dependency.source !== "starter"
          ).length || 0
        ),
        bdeps: String(
          config.dependencies?.backend?.filter(
            (dependency) => dependency.source !== "starter"
          ).length || 0
        ),
      });
      router.push(`/success?${q.toString()}`);
    } catch (downloadError) {
      const message =
        downloadError instanceof Error
          ? downloadError.message
          : "Generation failed";

      if (message !== "Redirecting to sign in...") {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  }, [busy, config, pathname, router]);

  useEffect(() => {
    if (!config || hasAutoStarted.current) {
      return;
    }

    if (searchParams.get("autoDownload") === "true") {
      hasAutoStarted.current = true;
      handleDownload();
    }
  }, [config, handleDownload, searchParams]);

  if (!config) {
    return null;
  }

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_55%,#f1f5f9_100%)]">
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
          <span className="w-max rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm backdrop-blur">
            Final Blueprint Preview
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Review your generated folder structure
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] font-medium leading-relaxed text-slate-500">
            This is the live project layout based on your selected stack,
            styling, UI choices, and optional files before download begins.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 shadow-sm">
              {formatStackLabel(config.stack)}
            </span>
            <span className="rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 shadow-sm">
              {formatLanguageLabel(config.language)}
            </span>
            <span className="rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 shadow-sm">
              {bundleLabel}
            </span>
          </div>

          <div className="mt-12 grid gap-8 xl:grid-cols-[440px_minmax(0,520px)] xl:justify-between xl:items-start">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Selected Configuration
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    Your choices
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                    Everything here is read-only. Use edit if you want to go back and change the setup.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  Edit
                </button>
              </div>

              <div className="mt-6 grid gap-x-4 gap-y-0 sm:grid-cols-2">
                <div className="border-b border-slate-200/80 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Project Name
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-slate-800">
                    {config.projectName || "my-app"}
                  </p>
                </div>
                <div className="border-b border-slate-200/80 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Language
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-slate-800">
                    {formatLanguageLabel(config.language)}
                  </p>
                </div>
                <div className="border-b border-slate-200/80 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Stack
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-slate-800">
                    {formatStackLabel(config.stack)}
                  </p>
                </div>
                <div className="border-b border-slate-200/80 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Styling
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-slate-800">
                    {config.styling || "Not selected"}
                  </p>
                </div>
                <div className="border-b border-slate-200/80 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    UI Library
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-slate-800">
                    {config.uiLib || "None"}
                  </p>
                </div>
                <div className="border-b border-slate-200/80 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    License
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-slate-800">
                    {config.license || "mit"}
                  </p>
                </div>
                <div className="border-b border-slate-200/80 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Testing
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-slate-800">
                    {formatToggleLabel(config.includeTests, "Included", "Not included")}
                  </p>
                </div>
                <div className="border-b border-slate-200/80 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    README
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-slate-800">
                    {formatToggleLabel(config.includeReadme, "Included", "Not included")}
                  </p>
                </div>
                <div className="py-4 sm:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Dependencies
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-slate-800">
                    {dependencyCount} selected
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full xl:justify-self-end">
              <FolderTreePreview
                variant="blueprint"
                rootName={rootName}
                nodes={treeNodes}
                headerTitle="Project Structure"
                heightClass="h-[680px]"
                footer={
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <span>{rootName}.zip</span>
                    <span>bootNode generated preview</span>
                  </div>
                }
              />
            </div>
          </div>

          {error ? (
            <div className="mt-6 w-full max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleDownload}
            disabled={busy}
            className="mt-8 inline-flex w-full max-w-[440px] cursor-pointer items-center justify-center gap-2 self-start rounded-2xl bg-[#116EF9] px-10 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-500/20 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {busy ? "Preparing download..." : "Download Project"}
          </button>
        </div>
      </section>
    </div>
  );
}
