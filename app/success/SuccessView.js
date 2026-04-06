"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import { generateProject } from "@/lib/downloadZip";
import { STYLING_PRESETS, UI_LIBRARY_PRESETS } from "@/lib/generation/catalog";
import { loadLastGeneratedProject, saveLastGeneratedProject } from "@/lib/projectPreview";

function formatStackLabel(stack) {
  const labels = {
    next: "Next.js",
    mern: "MERN Stack",
    django: "Django + React",
    vanilla: "Vanilla HTML/JS",
    html: "Vanilla HTML/JS",
    api: "API Project",
    "react-native": "React Native",
    flutter: "Flutter",
    swift: "Swift",
    kotlin: "Kotlin",
  };

  return labels[stack] || stack || "Project";
}

function buildInstallCommand(dependencies) {
  const normalDeps = dependencies
    .filter((dependency) => dependency.manager !== "python" && dependency.section !== "devDependencies")
    .map((dependency) => dependency.name);
  const devDeps = dependencies
    .filter((dependency) => dependency.manager !== "python" && dependency.section === "devDependencies")
    .map((dependency) => dependency.name);
  const pythonDeps = dependencies
    .filter((dependency) => dependency.manager === "python")
    .map((dependency) => dependency.name);
  const commands = [];

  if (normalDeps.length > 0) {
    commands.push(`npm install ${normalDeps.join(" ")}`);
  }

  if (devDeps.length > 0) {
    commands.push(`npm install -D ${devDeps.join(" ")}`);
  }

  if (pythonDeps.length > 0) {
    commands.push(`pip install ${pythonDeps.join(" ")}`);
  }

  return commands;
}

function buildChoiceCommands(config, target) {
  if (!config) {
    return [];
  }

  const dependencies = [];
  if (target.id === "frontend") {
    if (config.styling && STYLING_PRESETS[config.styling]) {
      dependencies.push(...STYLING_PRESETS[config.styling].dependencies);
    }

    if (config.uiLib && UI_LIBRARY_PRESETS[config.uiLib]) {
      dependencies.push(...UI_LIBRARY_PRESETS[config.uiLib].dependencies);
    }

    dependencies.push(
      ...(config.dependencies?.frontend || []).filter(
        (dependency) => dependency.source === "user"
      )
    );
  }

  if (target.id === "backend") {
    dependencies.push(
      ...(config.dependencies?.backend || []).filter(
        (dependency) => dependency.source === "user"
      )
    );
  }

  return buildInstallCommand(dependencies);
}

function buildCommandSections(project, config) {
  const stack = config?.stack || "next";
  const includeTests = Boolean(config?.includeTests);

  if (stack === "mern") {
    const serverDirectory = `${project}/server`;
    const clientDirectory = `${project}/client`;

    return [
      {
        title: "Terminal 1  Server",
        lines: [
          `cd ${serverDirectory}`,
          ...buildChoiceCommands(config, { id: "backend", directory: serverDirectory }),
          "npm install",
          "npm run dev",
          ...(includeTests ? ["# tests scaffold selected"] : []),
        ],
      },
      {
        title: "Terminal 2  Client",
        lines: [
          `cd ${clientDirectory}`,
          ...buildChoiceCommands(config, { id: "frontend", directory: clientDirectory }),
          "npm install",
          "npm run dev",
          ...(includeTests ? ["# tests scaffold selected"] : []),
        ],
      },
    ];
  }

  if (stack === "django") {
    const serverDirectory = `${project}/server`;
    const clientDirectory = `${project}/client`;

    return [
      {
        title: "Terminal 1  Backend",
        lines: [
          `cd ${serverDirectory}`,
          ...buildChoiceCommands(config, { id: "backend", directory: serverDirectory }),
          "pip install -r requirements/local.txt",
          "python manage.py migrate",
          "python manage.py runserver",
          ...(includeTests ? ["# pytest scaffold selected"] : []),
        ],
      },
      {
        title: "Terminal 2  Client",
        lines: [
          `cd ${clientDirectory}`,
          ...buildChoiceCommands(config, { id: "frontend", directory: clientDirectory }),
          "npm install",
          "npm run dev",
          ...(includeTests ? ["# test files were included in this scaffold"] : []),
        ],
      },
    ];
  }

  if (stack === "vanilla" || stack === "html") {
    return [
      {
        title: "Project setup",
        lines: [
          `cd ${project}`,
          ...buildChoiceCommands(config, { id: "frontend", directory: project }),
          "npm install",
          "npm run dev",
        ],
      },
    ];
  }

  return [
    {
      title: "Project setup",
      lines: [
        `cd ${project}`,
        ...buildChoiceCommands(config, { id: "frontend", directory: project }),
        "npm install",
        stack === "api" ? "npm start" : "npm run dev",
        ...(includeTests ? ["# tests scaffold selected"] : []),
      ],
    },
  ];
}

function buildCopyText(sections) {
  return sections.map((section) => section.lines.join("\n")).join("\n\n");
}

function ClipboardButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex cursor-pointer items-center justify-center rounded-xl border p-2.5 transition ${
          copied
            ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
            : "border-slate-700 bg-slate-900/70 text-slate-200 hover:border-slate-500 hover:bg-slate-800"
        }`}
      >
        {copied ? (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75A2.25 2.25 0 0111.25 10.5h7.5A2.25 2.25 0 0121 12.75v7.5A2.25 2.25 0 0118.75 22.5h-7.5A2.25 2.25 0 019 20.25v-7.5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5V6.75A2.25 2.25 0 0012.75 4.5h-7.5A2.25 2.25 0 003 6.75v7.5a2.25 2.25 0 002.25 2.25H9"
            />
          </svg>
        )}
      </button>
      {!copied ? (
        <div className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden whitespace-nowrap rounded-lg bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg group-hover:block">
          Copy commands
        </div>
      ) : null}
    </div>
  );
}

function CommandPanel({ sections }) {
  const commandText = useMemo(() => buildCopyText(sections), [sections]);

  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden rounded-[28px] bg-[#0D1116] p-0 shadow-2xl ring-1 ring-[#161B22]">
      <div className="flex items-center justify-between border-b border-[#161B22] bg-[#0D1116] px-5 py-4 sm:px-7">
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            terminal
          </span>
        </div>
        <ClipboardButton text={commandText} />
      </div>

      <div className="max-h-[520px] overflow-y-auto bg-[#0D1116] px-5 py-6 sm:px-7 sm:py-7">
        <div className="space-y-7 font-mono text-sm leading-7 text-slate-100">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                {section.title}
              </p>
              <div className="mt-3 space-y-1.5">
                {section.lines.map((line) => {
                  const isComment = line.startsWith("#");

                  return (
                    <p
                      key={`${section.title}-${line}`}
                      className={isComment ? "text-slate-500" : "text-slate-100"}
                    >
                      {isComment ? null : (
                        <span className="mr-2 select-none text-emerald-400">$</span>
                      )}
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function SuccessView() {
  const search = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedConfig, setSavedConfig] = useState(null);

  const project = search.get("project") || "my-project";
  const sizeKb = search.get("size") || "—";
  const stack = search.get("stack") || "next";
  const language = search.get("lang") || "ts";
  const styling = search.get("styling") || "";
  const uiLib = search.get("ui") || "";
  const includeTests = search.get("tests") === "1";
  const includeReadme = search.get("readme") !== "0";

  useEffect(() => {
    setSavedConfig(loadLastGeneratedProject());
  }, []);

  const effectiveConfig = useMemo(
    () =>
      savedConfig || {
        projectName: project,
        category: "web-dev",
        language,
        stack,
        styling,
        uiLib,
        includeTests,
        includeReadme,
        readmeContent: "",
        dependencies: { frontend: [], backend: [] },
      },
    [includeReadme, includeTests, language, project, savedConfig, stack, styling, uiLib]
  );

  const commandSections = useMemo(
    () => buildCommandSections(project, effectiveConfig),
    [effectiveConfig, project]
  );

  async function handleDownloadAgain() {
    if (!effectiveConfig || busy) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      await generateProject({
        projectName: effectiveConfig.projectName || project,
        category: effectiveConfig.category || "web-dev",
        language: effectiveConfig.language || "ts",
        stack: effectiveConfig.stack || stack,
        styling: effectiveConfig.styling || "",
        uiLibrary: effectiveConfig.uiLib || "",
        selectedLicense: effectiveConfig.license,
        includeTests: effectiveConfig.includeTests,
        includeReadme: effectiveConfig.includeReadme,
        readmeContent: effectiveConfig.readmeContent || "",
        clientDeps: (effectiveConfig.dependencies?.frontend || []).filter(
          (dependency) => dependency.source !== "starter"
        ),
        serverDeps: (effectiveConfig.dependencies?.backend || []).filter(
          (dependency) => dependency.source !== "starter"
        ),
        returnTo: "/success",
      });

      saveLastGeneratedProject(effectiveConfig);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error ? downloadError.message : "Download failed"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex-1 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-md shadow-blue-600/30">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          </div>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Project Successfully Generated &amp; Downloaded!
          </h1>
          <p className="mx-auto mt-4 max-w-4xl text-lg leading-8 text-slate-500">
            <span className="font-semibold text-slate-900">{`Your ${project} folder setup is ready.`}</span>{" "}
            The download should start automatically, and if it did not,{" "}
            <button
              type="button"
              onClick={handleDownloadAgain}
              disabled={busy}
              className="cursor-pointer font-semibold text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              download again
            </button>{" "}
            to download the project manually.{" "}
            <span className="font-medium text-slate-900 underline decoration-black underline-offset-4">
              Use the commands below to run the project after extracting the zip.
            </span>
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase tracking-wide text-slate-600">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              {formatStackLabel(effectiveConfig.stack || stack)}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              {effectiveConfig.language || language}
            </span>
            {sizeKb !== "—" ? (
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                {sizeKb} KB
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-14">
          <CommandPanel sections={commandSections} />
        </div>

        {error ? (
          <div className="mx-auto mt-6 w-full max-w-4xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-w-[160px] items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/stack-explorer"
            className="inline-flex min-w-[180px] items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-slate-50"
          >
            Create New Project
          </Link>
        </div>
      </div>
    </div>
  );
}
