import { safeProjectName } from "@/lib/safeProjectName";

/**
 * POST /api/generate with a project config and trigger browser download.
 */
export async function generateProject({
  projectName,
  category = "web-dev",
  language = "ts",
  stack,
  styling,
  uiLibrary,
  selectedLicense,
  includeTests = false,
  includeReadme = true,
  readmeContent = "",
  clientDeps = [],
  serverDeps = [],
  dependencies,
  returnTo,
}) {
  const safe = safeProjectName(projectName);
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectName: safe,
      category,
      language,
      stack,
      styling,
      uiLibrary,
      selectedLicense,
      includeTests,
      includeReadme,
      readmeContent,
      clientDeps,
      serverDeps,
      dependencies,
      returnTo,
    }),
  });

  if (!res.ok) {
    let message = "Generation failed";
    try {
      const data = await res.json();
      if (res.status === 401 && data?.redirectTo && typeof window !== "undefined") {
        window.location.href = data.redirectTo;
        throw new Error("Redirecting to sign in...");
      }
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const sessionId = res.headers.get("X-Session-Id");
  const filename = `${safe}.zip`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  if (sessionId) {
    fetch(`/api/generate?sessionId=${encodeURIComponent(sessionId)}`, {
      method: "DELETE",
      keepalive: true,
    }).catch(() => {
      // Ignore cleanup failures; the archive has already been received.
    });
  }

  const sizeKb = (blob.size / 1024).toFixed(1);
  return { sizeKb, filename, projectRoot: safe };
}
