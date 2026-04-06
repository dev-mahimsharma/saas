"use client";

import { useCallback, useMemo, useState } from "react";

function collectFolderPaths(nodes, prefix = "") {
  let out = [];
  for (const n of nodes) {
    if (n.type === "folder") {
      const p = `${prefix}${n.name}/`;
      out.push(p);
      if (n.children?.length) {
        out = out.concat(collectFolderPaths(n.children, p));
      }
    }
  }
  return out;
}

function Chevron({ open }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform ${
        open ? "rotate-90" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function FolderIcon({ open }) {
  return open ? (
    <svg
      className="h-4 w-4 shrink-0 text-amber-300"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </svg>
  ) : (
    <svg
      className="h-4 w-4 shrink-0 text-amber-400/90"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
    </svg>
  );
}

function FileIcon({ name }) {
  const ext = (name.split(".").pop() || "").toLowerCase();
  const cls = "h-4 w-4 shrink-0";
  if (ext === "json")
    return (
      <svg className={`${cls} text-yellow-400`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13.5h1v3h-1v-3zm3 0h1v3h-1v-3zm3 0h1v3h-1v-3z" />
      </svg>
    );
  if (ext === "css" || ext === "scss")
    return (
      <svg className={`${cls} text-sky-400`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm3 2v2h2V5H8zm0 4v8l3-2 3 2v-8H8z" />
      </svg>
    );
  if (ext === "html")
    return (
      <svg className={`${cls} text-orange-400`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4zm-1 6h2v6h-2V8zm0 8h2v2h-2v-2z" />
      </svg>
    );
  if (ext === "vue")
    return (
      <svg className={`${cls} text-emerald-400`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M2 3h4l2 12 4-9 4 9 2-12h4L16 21h-4L8 6 4 21H0L2 3z" />
      </svg>
    );
  if (ext === "svelte" || name.endsWith(".svelte"))
    return (
      <svg className={`${cls} text-red-400`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M10.354 21.125a8.6 8.6 0 01-5.44-1.855A7.49 7.49 0 013.177 17.45a6.81 6.81 0 01-.951-2.05A6.3 6.3 0 012 12c0-.938.18-1.854.526-2.702a6.81 6.81 0 01.951-2.05 7.49 7.49 0 011.737-1.818L12 2l8.785 5.43a7.49 7.49 0 011.737 1.818 6.81 6.81 0 01.951 2.05A6.3 6.3 0 0122 12c0 .938-.18 1.854-.526 2.702a6.81 6.81 0 01-.951 2.05 7.49 7.49 0 01-1.737 1.818L12 22l-1.646-1.018v-4.857H10.354v4.857z" />
      </svg>
    );
  if (ext === "md")
    return (
      <svg className={`${cls} text-slate-400`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
      </svg>
    );
  if (ext === "mjs" || ext === "js" || ext === "jsx" || ext === "cjs")
    return (
      <svg className={`${cls} text-amber-200`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M3 3h18v18H3V3zm4.5 5.5L9 10l-1.5 1.5v5L9 18l1.5-1.5v-5zm5 1L14 12l-1.5 1.5v2L14 17l1.5-1.5v-2zm3.5-1L18 10l1.5 1.5v5L18 18l-1.5-1.5v-5z" />
      </svg>
    );
  if (ext === "ts" || ext === "tsx")
    return (
      <svg className={`${cls} text-blue-400`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M3 3h18v18H3V3zm4.5 5.5L9 10l-1.5 1.5v5L9 18l1.5-1.5v-5zm5 1L14 12l-1.5 1.5v2L14 17l1.5-1.5v-2zm3.5-1L18 10l1.5 1.5v5L18 18l-1.5-1.5v-5z" />
      </svg>
    );
  if (ext === "astro" || name.endsWith(".astro"))
    return (
      <svg className={`${cls} text-violet-400`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5 9.5 9.75 12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
      </svg>
    );
  return (
    <svg
      className={`${cls} text-slate-400`}
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
  );
}

function TreeNodes({
  nodes,
  pathPrefix,
  depth,
  collapsed,
  toggleFolder,
  isFolderOpen,
  onSelectFile,
  selectedPath,
}) {
  return (
    <div className="select-none">
      {nodes.map((node) => {
        const path =
          node.type === "folder"
            ? `${pathPrefix}${node.name}/`
            : `${pathPrefix}${node.name}`;
        if (node.type === "folder") {
          const open = isFolderOpen(path);
          return (
            <div key={path}>
              <button
                type="button"
                onClick={() => toggleFolder(path)}
                className="flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1 pr-2 text-left font-mono text-[12px] text-amber-100/95 transition hover:bg-slate-800/80"
                style={{ paddingLeft: 8 + depth * 14 }}
              >
                <Chevron open={open} />
                <FolderIcon open={open} />
                <span>{node.name}/</span>
              </button>
              {open && node.children?.length ? (
                <TreeNodes
                  nodes={node.children}
                  pathPrefix={path}
                  depth={depth + 1}
                  collapsed={collapsed}
                  toggleFolder={toggleFolder}
                  isFolderOpen={isFolderOpen}
                  onSelectFile={onSelectFile}
                  selectedPath={selectedPath}
                />
              ) : null}
            </div>
          );
        }
        const active = selectedPath === path;
        return (
          <button
            type="button"
            key={path}
            onClick={() =>
              onSelectFile({
                path,
                name: node.name,
                snippet: node.snippet || null,
              })
            }
            className={`flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-2 text-left font-mono text-[12px] transition hover:bg-slate-800/80 ${
              active ? "bg-slate-800 text-amber-100" : "text-slate-200"
            }`}
            style={{ paddingLeft: 8 + depth * 14 + 18 }}
          >
            <FileIcon name={node.name} />
            <span>{node.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function FolderTreePreview({
  rootName,
  nodes,
  headerTitle,
  headerRight,
  footer,
  variant = "live",
  heightClass = "h-[500px]",
}) {
  const folderPaths = useMemo(() => collectFolderPaths(nodes), [nodes]);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [selected, setSelected] = useState(null);

  const rootPath = `${rootName}/`;

  const isFolderOpen = useCallback(
    (path) => !collapsed.has(path),
    [collapsed]
  );

  const toggleFolder = useCallback((path) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => setCollapsed(new Set()), []);
  const collapseAll = useCallback(() => {
    setCollapsed(new Set([rootPath, ...folderPaths]));
  }, [folderPaths, rootPath]);

  const rootOpen = !collapsed.has(rootPath);
  const toggleRoot = () => toggleFolder(rootPath);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl bg-[#1E293B] shadow-xl ring-1 ring-slate-800 ${heightClass}`}
    >
      {variant === "live" ? (
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/90" />
            <span className="h-3 w-3 rounded-full bg-amber-400/90" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {headerTitle}
          </p>
          <span className="w-14" />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-3">
          <p className="text-sm font-semibold text-white">{headerTitle}</p>
          <div className="flex items-center gap-3">
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={expandAll}
                className="text-[10px] font-bold uppercase tracking-wide text-slate-500 hover:text-slate-300"
              >
                Expand
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="text-[10px] font-bold uppercase tracking-wide text-slate-500 hover:text-slate-300"
              >
                Collapse
              </button>
            </div>
            {headerRight}
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar">
          <button
            type="button"
            onClick={toggleRoot}
            className="flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1 pr-2 text-left font-mono text-[12px] text-amber-100/95 transition hover:bg-slate-800/80"
            style={{ paddingLeft: 8 }}
          >
            <Chevron open={rootOpen} />
            <FolderIcon open={rootOpen} />
            <span>{rootName}/</span>
          </button>
          {rootOpen ? (
            <TreeNodes
              nodes={nodes}
              pathPrefix={rootPath}
              depth={0}
              collapsed={collapsed}
              toggleFolder={toggleFolder}
              isFolderOpen={isFolderOpen}
              onSelectFile={setSelected}
              selectedPath={selected?.path}
            />
          ) : null}
        </div>
      </div>

      {footer ? (
        <div className="border-t border-slate-800">{footer}</div>
      ) : null}
    </div>
  );
}
