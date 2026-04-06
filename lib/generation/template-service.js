import path from "path";
import { randomUUID } from "crypto";
import fs from "fs-extra";
import { GenerationError } from "@/lib/generation/errors";

function legacyStackFolder(language, stack) {
  if (stack !== "vanilla") {
    return stack;
  }

  return language === "javascript" ? "vanilla-js-starter" : "vanilla-ts-starter";
}

export class TemplateService {
  constructor({
    templatesRoot = path.join(process.cwd(), "templates"),
    tempRoot = path.join(process.cwd(), "temp"),
  } = {}) {
    this.templatesRoot = templatesRoot;
    this.tempRoot = tempRoot;
  }

  async createSessionProject(config) {
    const sourceDir = await this.resolveTemplateDir(config);
    const sessionId = randomUUID();
    const sessionRoot = path.join(this.tempRoot, sessionId);
    const projectDir = path.join(sessionRoot, config.projectName);

    await fs.ensureDir(sessionRoot);
    await fs.copy(sourceDir, projectDir);

    return {
      sessionId,
      sessionRoot,
      projectDir,
      sourceDir,
    };
  }

  async resolveTemplateDir(config) {
    const stackFolder = legacyStackFolder(config.language, config.stack);
    const candidates = [
      path.join(this.templatesRoot, config.category, config.language, stackFolder),
      path.join(this.templatesRoot, config.category, config.language, config.stack),
      path.join(this.templatesRoot, config.category, `${config.language}-version`, stackFolder),
      path.join(this.templatesRoot, config.category, stackFolder),
    ];

    for (const candidate of candidates) {
      if (await fs.pathExists(candidate)) {
        const stats = await fs.stat(candidate);
        if (stats.isDirectory()) {
          return candidate;
        }
      }
    }

    throw new GenerationError(
      `Template folder not found for ${config.category}/${config.language}/${config.rawStack || config.stack}.`,
      404
    );
  }

  async cleanupSession(sessionId) {
    if (!sessionId) {
      return;
    }

    const target = path.resolve(this.tempRoot, sessionId);
    const root = path.resolve(this.tempRoot);

    if (!target.startsWith(root)) {
      throw new GenerationError("Refused to clean up an invalid session path.", 400);
    }

    await fs.remove(target);
  }
}
