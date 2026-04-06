export class GenerationError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "GenerationError";
    this.status = status;
  }
}
