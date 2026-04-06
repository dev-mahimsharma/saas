"use client";

import { getStructureTree } from "@/data/structureTrees";
import { safeProjectName } from "@/lib/safeProjectName";

export const PENDING_PROJECT_PREVIEW_KEY = "pending_project_preview_v1";
export const LAST_GENERATED_PROJECT_KEY = "last_generated_project_v1";
export const WIZARD_STORAGE_KEY = "wizard_state_v2";
export const WIZARD_RELOAD_FLAG = "wizard_state_v2_reload";
export const WIZARD_EDIT_MODE_KEY = "wizard_state_v2_edit_mode";

function cloneTree(tree) {
  return JSON.parse(JSON.stringify(tree));
}

function createFile(name, snippet = "") {
  return { type: "file", name, snippet };
}

function createFolder(name, children = []) {
  return { type: "folder", name, children };
}

function ensureFolder(nodes, folderName) {
  let folder = nodes.find((node) => node.type === "folder" && node.name === folderName);

  if (!folder) {
    folder = createFolder(folderName, []);
    nodes.push(folder);
  }

  if (!Array.isArray(folder.children)) {
    folder.children = [];
  }

  return folder;
}

function addUniqueNode(nodes, node) {
  if (!nodes.some((entry) => entry.type === node.type && entry.name === node.name)) {
    nodes.push(node);
  }
}

function removeNodeByName(nodes, targetName) {
  return nodes.filter((node) => node.name !== targetName);
}

function getPrimaryAppFolder(tree, stack) {
  if (stack === "next") {
    return ensureFolder(tree, "components");
  }

  if (stack === "mern" || stack === "django") {
    const client = ensureFolder(tree, "client");
    const src = ensureFolder(client.children, "src");
    return ensureFolder(src.children, "components");
  }

  return ensureFolder(tree, "src");
}

function applyReadmeOption(tree, includeReadme) {
  if (!includeReadme) {
    return removeNodeByName(tree, "README.md");
  }

  addUniqueNode(tree, createFile("README.md", "# Project overview\n"));
  return tree;
}

function applyTestingOption(tree, { includeTests, stack, language }) {
  if (!includeTests || stack === "vanilla") {
    return tree;
  }

  const ext = language === "ts" ? "ts" : "js";
  const reactExt = language === "ts" ? "tsx" : "jsx";

  if (stack === "mern") {
    const client = ensureFolder(tree, "client");
    const clientSrc = ensureFolder(client.children, "src");
    const clientTests = ensureFolder(clientSrc.children, "__tests__");
    addUniqueNode(
      clientTests.children,
      createFile(`App.test.${reactExt}`, "describe('App', () => {\n  it('renders', () => {});\n});")
    );

    const server = ensureFolder(tree, "server");
    const serverTests = ensureFolder(server.children, "tests");
    addUniqueNode(
      serverTests.children,
      createFile(`api.test.${ext}`, "describe('API', () => {\n  it('responds', () => {});\n});")
    );
    addUniqueNode(tree, createFile(`jest.config.${ext}`, "export default {};\n"));
    return tree;
  }

  if (stack === "django") {
    const client = ensureFolder(tree, "client");
    const clientSrc = ensureFolder(client.children, "src");
    const clientTests = ensureFolder(clientSrc.children, "__tests__");
    addUniqueNode(
      clientTests.children,
      createFile(`App.test.${reactExt}`, "describe('App', () => {\n  it('renders', () => {});\n});")
    );

    const server = ensureFolder(tree, "server");
    const testsFolder = ensureFolder(server.children, "tests");
    addUniqueNode(
      testsFolder.children,
      createFile(`test_api.${ext}`, "def test_healthcheck():\n    assert True\n")
    );
    return tree;
  }

  const testsFolder = ensureFolder(tree, "tests");
  addUniqueNode(
    testsFolder.children,
    createFile(`app.test.${reactExt}`, "describe('app', () => {\n  it('works', () => {});\n});")
  );
  addUniqueNode(tree, createFile(`jest.config.${ext}`, "export default {};\n"));
  return tree;
}

function applyStylingOption(tree, { stack, styling, language }) {
  if (!styling) {
    return tree;
  }

  const configExt = language === "ts" ? "ts" : "js";

  if (styling === "tailwind") {
    addUniqueNode(tree, createFile(`tailwind.config.${configExt}`, "export default {};\n"));
    addUniqueNode(tree, createFile(`postcss.config.${configExt === "ts" ? "js" : configExt}`, "export default {};\n"));
    return tree;
  }

  if (styling === "bootstrap") {
    const targetFolder =
      stack === "mern" || stack === "django"
        ? ensureFolder(ensureFolder(tree, "client").children, "src")
        : stack === "next"
          ? ensureFolder(tree, "app")
          : ensureFolder(tree, "src");

    addUniqueNode(targetFolder.children, createFile("bootstrap-overrides.css", "/* Bootstrap theme overrides */\n"));
    return tree;
  }

  if (styling === "scss") {
    const targetFolder =
      stack === "mern" || stack === "django"
        ? ensureFolder(ensureFolder(tree, "client").children, "src")
        : stack === "next"
          ? ensureFolder(tree, "app")
          : ensureFolder(tree, "src");

    addUniqueNode(targetFolder.children, createFile("styles.scss", "$brand-color: #116ef9;\n"));
    return tree;
  }

  if (styling === "unocss") {
    addUniqueNode(tree, createFile(`uno.config.${configExt}`, "export default {};\n"));
  }

  return tree;
}

function applyUiLibraryOption(tree, { stack, uiLib, language }) {
  if (!uiLib) {
    return tree;
  }

  const componentExt = language === "ts" ? "tsx" : "jsx";
  const componentFolder = ensureFolder(getPrimaryAppFolder(tree, stack).children, "ui");
  const fileName = uiLib === "shadcn" ? `button.${componentExt}` : `${uiLib}-kit.${componentExt}`;

  addUniqueNode(
    componentFolder.children,
    createFile(
      fileName,
      `export default function ${uiLib[0].toUpperCase()}${uiLib.slice(1)}Component() {\n  return null;\n}\n`
    )
  );

  return tree;
}

export function getProjectPreviewTree(config = {}) {
  const stack = config.stack || "next";
  const language = config.language || "ts";

  let tree = cloneTree(getStructureTree(stack, language));
  tree = applyReadmeOption(tree, config.includeReadme ?? true);
  tree = applyTestingOption(tree, {
    includeTests: config.includeTests,
    stack,
    language,
  });
  tree = applyStylingOption(tree, {
    stack,
    styling: config.styling,
    language,
  });
  tree = applyUiLibraryOption(tree, {
    stack,
    uiLib: config.uiLib,
    language,
  });

  return tree;
}

export function getProjectPreviewRootName(projectName) {
  return safeProjectName(projectName || "my-app");
}

export function getProjectPreviewBundleLabel(config = {}) {
  const baseMap = {
    next: 28,
    mern: 32,
    django: 26,
    vanilla: 6,
  };

  let size = baseMap[config.stack] ?? 20;
  if (config.includeTests) size += 3;
  if (config.uiLib) size += 2;
  if (config.styling && config.styling !== "tailwind") size += 1;

  return `~${size} MB`;
}

export function savePendingProjectPreview(config) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(PENDING_PROJECT_PREVIEW_KEY, JSON.stringify(config));
}

export function loadPendingProjectPreview() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(PENDING_PROJECT_PREVIEW_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingProjectPreview() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(PENDING_PROJECT_PREVIEW_KEY);
}

export function saveLastGeneratedProject(config) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(LAST_GENERATED_PROJECT_KEY, JSON.stringify(config));
}

export function loadLastGeneratedProject() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(LAST_GENERATED_PROJECT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function buildWizardDraftFromPreview(config) {
  return {
    projectName: config.projectName || "",
    language: config.language || "ts",
    stack: config.stack || "",
    styling: config.styling || "",
    uiLib: config.uiLib || "",
    dependencies: config.dependencies || { frontend: [], backend: [] },
    dependencyTarget: config.dependencyTarget || "frontend",
    currentStep: 1,
    license: config.license || "mit",
    includeTests: config.includeTests ?? false,
    includeReadme: config.includeReadme ?? true,
    readmeContent: config.readmeContent ?? "",
  };
}

export function restoreWizardDraft(config) {
  if (typeof window === "undefined" || !config) {
    return;
  }

  const wizardDraft = buildWizardDraftFromPreview(config);

  sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(wizardDraft));
  sessionStorage.setItem(WIZARD_RELOAD_FLAG, "true");
  sessionStorage.setItem(WIZARD_EDIT_MODE_KEY, "true");
}
