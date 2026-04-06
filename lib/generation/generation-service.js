import { TemplateService } from "@/lib/generation/template-service";
import { DependencyService } from "@/lib/generation/dependency-service";
import { FeatureService } from "@/lib/generation/feature-service";
import { ArchiveService } from "@/lib/generation/archive-service";
import { GenerationError } from "@/lib/generation/errors";
import { normalizeUserConfig } from "@/lib/generation/config";

export class GenerationService {
  constructor({
    templateService = new TemplateService(),
    dependencyService = new DependencyService(),
    featureService = new FeatureService(),
    archiveService = new ArchiveService(),
  } = {}) {
    this.templateService = templateService;
    this.dependencyService = dependencyService;
    this.featureService = featureService;
    this.archiveService = archiveService;
  }

  async generate(input) {
    const config = normalizeUserConfig(input);

    if (!config.stack) {
      throw new GenerationError("Invalid or missing stack.", 400);
    }

    const session = await this.templateService.createSessionProject(config);

    try {
      await this.dependencyService.injectDependencies(session.projectDir, config);
      await this.featureService.applyFeatures({
        config,
        projectDir: session.projectDir,
      });

      const buffer = await this.archiveService.zipDirectory(session.sessionRoot);

      return {
        sessionId: session.sessionId,
        projectRoot: config.projectName,
        zipFilename: `${config.projectName}.zip`,
        buffer,
      };
    } catch (error) {
      await this.templateService.cleanupSession(session.sessionId);
      throw error;
    }
  }

  async cleanup(sessionId) {
    await this.templateService.cleanupSession(sessionId);
  }
}
