import path from "path";
import fs from "fs-extra";

function sortObject(input = {}) {
  return Object.fromEntries(
    Object.entries(input).sort(([left], [right]) => left.localeCompare(right))
  );
}

export class DependencyService {
  async injectDependencies(projectDir, { clientDeps = [], serverDeps = [] }) {
    const clientPackagePath = await this.findPackageJson(projectDir, "client");
    const serverPackagePath = await this.findPackageJson(projectDir, "server");
    const serverRequirementsPath = await this.findServerRequirements(projectDir);

    if (clientPackagePath && clientDeps.length > 0) {
      await this.mergeDependencies(clientPackagePath, clientDeps);
    }

    if (serverPackagePath && serverDeps.length > 0) {
      await this.mergeDependencies(serverPackagePath, serverDeps);
    } else if (serverRequirementsPath && serverDeps.length > 0) {
      await this.mergePythonDependencies(serverRequirementsPath, serverDeps);
    }
  }

  async findPackageJson(projectDir, target) {
    const directPath = path.join(projectDir, target, "package.json");
    if (await fs.pathExists(directPath)) {
      return directPath;
    }

    if (target === "client") {
      const rootPath = path.join(projectDir, "package.json");
      if (await fs.pathExists(rootPath)) {
        return rootPath;
      }
    }

    return null;
  }

  async mergeDependencies(packageJsonPath, dependencyList) {
    const pkg = await fs.readJson(packageJsonPath);
    for (const dependency of dependencyList) {
      if (dependency.manager && dependency.manager !== "npm") {
        continue;
      }

      const section = dependency.section || "dependencies";
      const nextDependencies = { ...(pkg[section] || {}) };

      if (!nextDependencies[dependency.name]) {
        nextDependencies[dependency.name] = dependency.version;
      }

      pkg[section] = sortObject(nextDependencies);
    }

    await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
  }

  async findServerRequirements(projectDir) {
    const baseRequirements = path.join(projectDir, "server", "requirements", "base.txt");
    if (await fs.pathExists(baseRequirements)) {
      return baseRequirements;
    }

    return null;
  }

  async mergePythonDependencies(requirementsPath, dependencyList) {
    const existingContent = await fs.readFile(requirementsPath, "utf8");
    const existingLines = existingContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const existingSet = new Set(existingLines.map((line) => line.toLowerCase()));
    const additions = [];

    for (const dependency of dependencyList) {
      if (dependency.manager !== "python") {
        continue;
      }

      const requirement = dependency.version && dependency.version !== "latest"
        ? `${dependency.name}${dependency.version.startsWith("=") || dependency.version.startsWith(">") || dependency.version.startsWith("<") ? dependency.version : `==${dependency.version}`}`
        : dependency.name;

      if (!existingSet.has(requirement.toLowerCase())) {
        existingSet.add(requirement.toLowerCase());
        additions.push(requirement);
      }
    }

    if (additions.length > 0) {
      const nextContent = `${existingContent.trimEnd()}\n${additions.join("\n")}\n`;
      await fs.writeFile(requirementsPath, nextContent, "utf8");
    }
  }
}
