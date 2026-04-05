/**
 * Sanitize user project name for zip filename and root folder inside the archive.
 */
export function safeProjectName(name) {
  const raw = (name || "my-project").trim();
  const cleaned = raw.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
  const base = cleaned.replace(/^-|-$/g, "") || "my-project";
  return base.slice(0, 64);
}
