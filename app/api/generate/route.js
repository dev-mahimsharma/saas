import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GenerationService } from "@/lib/generation/generation-service";
import { GenerationError } from "@/lib/generation/errors";

export const runtime = "nodejs";

const generationService = new GenerationService();

function buildUnauthorizedResponse(callbackUrl) {
  return Response.json(
    {
      error: "Please sign in to generate and download projects.",
      redirectTo: `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    },
    { status: 401 }
  );
}

function resolveCallbackUrl(body) {
  return typeof body?.returnTo === "string" && body.returnTo.startsWith("/")
    ? body.returnTo
    : "/web-development";
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const callbackUrl = resolveCallbackUrl(body);
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return buildUnauthorizedResponse(callbackUrl);
  }

  try {
    const result = await generationService.generate(body);

    return new Response(result.buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${result.zipFilename}"`,
        "Content-Length": String(result.buffer.length),
        "X-Project-Name": result.projectRoot,
        "X-Session-Id": result.sessionId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    const status = error instanceof GenerationError ? error.status : 500;
    return Response.json({ error: message }, { status });
  }
}

export async function DELETE(request) {
  let sessionId = "";

  try {
    const url = new URL(request.url);
    sessionId = url.searchParams.get("sessionId") || "";
  } catch {
    sessionId = "";
  }

  if (!sessionId) {
    try {
      const body = await request.json();
      sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
    } catch {
      sessionId = "";
    }
  }

  if (!sessionId) {
    return Response.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    await generationService.cleanup(sessionId);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cleanup failed";
    const status = error instanceof GenerationError ? error.status : 500;
    return Response.json({ error: message }, { status });
  }
}
