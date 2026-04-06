import { safeProjectName } from "@/lib/safeProjectName";

/**
 * POST /api/generate with { stack, projectName } and trigger browser download.
 * @param {{ stack: string, projectName?: string, returnTo?: string }} params
 */
export async function generateProject({ stack, projectName, returnTo }) {
  const safe = safeProjectName(projectName);
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stack, projectName: safe, returnTo }),
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
  const filename = `${safe}.zip`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  const sizeKb = (blob.size / 1024).toFixed(1);
  return { sizeKb, filename, projectRoot: safe };
}
