export const runtime = "nodejs";
const PYPI_TIMEOUT_MS = 900;

function normalizeNpmResults(data) {
  const objects = Array.isArray(data?.objects) ? data.objects : [];

  return objects.map((entry) => ({
    name: entry.package?.name || "",
    version: entry.package?.version || "latest",
    type: "npm",
  })).filter((entry) => entry.name);
}

async function searchNpm(query) {
  const response = await fetch(
    `https://registry.npmjs.com/-/v1/search?text=${encodeURIComponent(query)}&size=5`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch npm packages.");
  }

  const data = await response.json();
  return normalizeNpmResults(data);
}

async function searchPypi(query) {
  const response = await fetch(
    `https://pypi.org/pypi/${encodeURIComponent(query)}/json`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(PYPI_TIMEOUT_MS),
    }
  ).catch(() => null);

  if (!response?.ok) {
    return [];
  }

  const data = await response.json();

  return [
    {
      name: data?.info?.name || query,
      version: data?.info?.version || "latest",
      type: "PyPI",
    },
  ];
}

function dedupeResults(results) {
  const seen = new Set();

  return results.filter((entry) => {
    const key = `${entry.type}:${entry.name}`.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";

  if (!query) {
    return Response.json({ results: [] });
  }

  const [npmResult, pypiResult] = await Promise.allSettled([
    searchNpm(query),
    searchPypi(query),
  ]);

  const results = dedupeResults([
    ...(npmResult.status === "fulfilled" ? npmResult.value : []),
    ...(pypiResult.status === "fulfilled" ? pypiResult.value : []),
  ]);

  return Response.json({
    results,
    meta: {
      npmOk: npmResult.status === "fulfilled",
      pypiOk: pypiResult.status === "fulfilled",
    },
  });
}
