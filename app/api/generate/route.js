import archiver from "archiver";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { safeProjectName } from "@/lib/safeProjectName";

export const runtime = "nodejs";

const TEMPLATE_MAP = {
  html: "basic-html",
  react: "react-vite",
  vue: "vue-vite",
  next: "nextjs-app",
  mern: "mern-stack",
  svelte: "svelte-vite",
  astro: "astro-app",
  api: "express-api",
};

const ALLOWED_STACKS = Object.keys(TEMPLATE_MAP);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const callbackUrl =
    typeof body?.returnTo === "string" && body.returnTo.startsWith("/")
      ? body.returnTo
      : "/web-development";

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json(
      {
        error: "Please sign in to generate and download projects.",
        redirectTo: `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      },
      { status: 401 }
    );
  }

  const stack = body?.stack;
  if (!stack || typeof stack !== "string") {
    return Response.json({ error: "Missing stack" }, { status: 400 });
  }

  if (!ALLOWED_STACKS.includes(stack)) {
    return Response.json({ error: "Invalid stack" }, { status: 400 });
  }

  const projectRoot = safeProjectName(body?.projectName);
  const folderName = TEMPLATE_MAP[stack];
  const templatesRoot = path.join(process.cwd(), "templates");
  const sourceDir = path.join(templatesRoot, folderName);

  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    return Response.json({ error: "Template not found on disk" }, { status: 404 });
  }

  const chunks = [];
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    throw err;
  });
  archive.on("data", (chunk) => chunks.push(chunk));

  archive.directory(sourceDir, projectRoot);

  await archive.finalize();

  const buffer = Buffer.concat(chunks);
  const zipFilename = `${projectRoot}.zip`;

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${zipFilename}"`,
      "Content-Length": String(buffer.length),
      "X-Project-Name": projectRoot,
    },
  });
}
