import { safeProjectName } from "@/lib/safeProjectName";

const LANGUAGE_MAP = {
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
};

const STACK_MAP = {
  next: "nextjs",
  "next.js": "nextjs",
  nextjs: "nextjs",
  mern: "mern",
  django: "django-react",
  "django-react": "django-react",
  vanilla: "vanilla",
  html: "vanilla",
  "vanilla js": "vanilla",
  "vanilla javascript": "vanilla",
  "vanilla html/js": "vanilla",
  "vanilla-html-js": "vanilla",
};

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return fallback;
}

function normalizeDependencyList(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  const seen = new Set();
  const normalized = [];

  for (const entry of input) {
    const rawName =
      typeof entry === "string"
        ? entry
        : typeof entry?.name === "string"
          ? entry.name
          : "";
    const name = rawName.trim();

    if (!name) {
      continue;
    }

    const key = name.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push({
      name,
      version:
        typeof entry === "object" && typeof entry?.version === "string" && entry.version.trim()
          ? entry.version.trim()
          : "latest",
    });
  }

  return normalized;
}

export function normalizeUserConfig(input = {}) {
  const rawStack = String(input.stack || "").trim();
  const stackKey = STACK_MAP[rawStack.toLowerCase()];
  const language = LANGUAGE_MAP[String(input.language || "ts").toLowerCase()] || "typescript";
  const projectName = safeProjectName(input.projectName);
  const category = String(input.category || "web-dev").trim() || "web-dev";
  const includeTests =
    normalizeBoolean(input.includeTests, normalizeBoolean(input.tests, false)) &&
    stackKey !== "vanilla";
  const includeReadme = normalizeBoolean(input.includeReadme, true);
  const clientDeps = normalizeDependencyList(
    input.clientDeps ?? input.dependencies?.frontend ?? []
  );
  const serverDeps = normalizeDependencyList(
    input.serverDeps ?? input.dependencies?.backend ?? []
  );

  return {
    projectName,
    category,
    language,
    stack: stackKey,
    rawStack: rawStack || "next",
    styling: String(input.styling || input.style || "").trim().toLowerCase(),
    uiLibrary: String(input.uiLibrary || input.uiLib || "").trim().toLowerCase(),
    selectedLicense: String(input.selectedLicense || input.license || "none").trim().toLowerCase(),
    includeTests,
    includeReadme,
    readmeContent: typeof input.readmeContent === "string" ? input.readmeContent.trim() : "",
    clientDeps,
    serverDeps,
  };
}
