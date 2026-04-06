import archiver from "archiver";

export class ArchiveService {
  async zipDirectory(sourceDir) {
    const chunks = [];
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("data", (chunk) => chunks.push(chunk));

    const archivePromise = new Promise((resolve, reject) => {
      archive.on("error", reject);
      archive.on("end", resolve);
    });

    archive.directory(sourceDir, false);
    await archive.finalize();
    await archivePromise;

    return Buffer.concat(chunks);
  }
}
