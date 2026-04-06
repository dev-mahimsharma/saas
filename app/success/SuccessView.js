"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";

function TerminalBlock({ project, stack }) {
  if (stack === "api") {
    return (
      <div className="rounded-xl bg-[#1e293b] p-4 font-mono text-sm leading-relaxed text-slate-200">
        <p>
          <span className="text-emerald-400">$</span> cd {project}
        </p>
        <p className="mt-2">
          <span className="text-emerald-400">$</span> npm install
        </p>
        <p className="mt-2">
          <span className="text-emerald-400">$</span> npm start
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Try GET /health and GET /users
        </p>
      </div>
    );
  }

  if (stack === "html") {
    return (
      <div className="rounded-xl bg-[#1e293b] p-4 font-mono text-sm leading-relaxed text-slate-200">
        <p>
          <span className="text-emerald-400">$</span> cd {project}
        </p>
        <p className="mt-2 text-slate-400">
          Open <span className="text-slate-200">index.html</span> in your
          browser, or use a static server:
        </p>
        <p className="mt-2">
          <span className="text-emerald-400">$</span> npx serve .
        </p>
      </div>
    );
  }

  if (stack === "mern") {
    return (
      <div className="rounded-xl bg-[#1e293b] p-4 font-mono text-sm leading-relaxed text-slate-200">
        <p className="text-slate-400"># Terminal 1 — API</p>
        <p className="mt-2">
          <span className="text-emerald-400">$</span> cd {project}/server
        </p>
        <p className="mt-2">
          <span className="text-emerald-400">$</span> npm install
        </p>
        <p className="mt-2">
          <span className="text-emerald-400">$</span> npm start
        </p>
        <p className="mt-4 text-slate-400"># Terminal 2 — Client</p>
        <p className="mt-2">
          <span className="text-emerald-400">$</span> cd {project}/client
        </p>
        <p className="mt-2">
          <span className="text-emerald-400">$</span> npm install
        </p>
        <p className="mt-2">
          <span className="text-emerald-400">$</span> npm run dev
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#1e293b] p-4 font-mono text-sm leading-relaxed text-slate-200">
      <p>
        <span className="text-emerald-400">$</span> cd {project}
      </p>
      <p className="mt-2">
        <span className="text-emerald-400">$</span> npm install
      </p>
      <p className="mt-2">
        <span className="text-emerald-400">$</span> npm run dev
      </p>
    </div>
  );
}

export default function SuccessView() {
  const search = useSearchParams();
  const project = search.get("project") || "my-project";
  const sizeKb = search.get("size") || "—";
  const stack = search.get("stack") || "next";
  const zipFile = search.get("file") || `${project}.zip`;

  return (
    <div className="flex-1 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Your distributed architecture is ready for deployment. The localized
            environment contains all pre-configured node schemas and secure boot
            protocols.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl ring-1 ring-slate-800 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <svg
                className="h-5 w-5 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
              </svg>
              Archive manifest
            </div>
            <dl className="mt-8 space-y-5">
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <dt className="text-sm text-slate-400">Project name</dt>
                <dd className="font-mono text-sm font-semibold">{project}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <dt className="text-sm text-slate-400">Archive file</dt>
                <dd className="max-w-[55%] truncate font-mono text-xs font-semibold text-right">
                  {zipFile}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <dt className="text-sm text-slate-400">Compressed size</dt>
                <dd className="text-sm font-semibold">
                  {sizeKb === "—" ? "—" : `${sizeKb} KB`}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <dt className="text-sm text-slate-400">Stack</dt>
                <dd className="text-sm font-semibold uppercase">{stack}</dd>
              </div>

            </dl>
            <div className="mt-8 flex items-start gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <span>
                Checksum verified against bootNode master registry.
              </span>
            </div>
          </div>

          <Card className="p-0 shadow-xl ring-1 ring-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 7.5l3 2.25-3 2.25m9-4.5h-3"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 5.25h15A1.5 1.5 0 0121 6.75v10.5a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z"
                    />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  Initialize workspace
                </span>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
                Ready for node
              </span>
            </div>
            <div className="px-6 py-6">
              <TerminalBlock project={project} stack={stack} />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex min-w-[140px] flex-1 items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Back to Dashboard
                </Link>
                <Link
                  href="/stack-explorer"
                  className="inline-flex min-w-[160px] flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-slate-50"
                >
                  + Create New Project
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <button
            type="button"
            className="inline-flex items-center gap-2 font-medium transition hover:text-slate-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z"
              />
            </svg>
            Share config
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 font-medium transition hover:text-slate-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            Docs
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 font-medium transition hover:text-slate-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
            Support
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 font-medium transition hover:text-slate-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354.056-2.686-.15-3.89-.558-1.018-.396-1.925-.98-2.681-1.8l-1.232-.92a1.125 1.125 0 00-1.35 0l-6 4.5A1.125 1.125 0 011.5 15.511v-4.286c0-1.136.847-2.1 1.98-2.193.34-.027.68-.052 1.02-.072V5.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0120.25 8.511z"
              />
            </svg>
            Join community
          </button>
        </div>
      </div>
    </div>
  );
}
