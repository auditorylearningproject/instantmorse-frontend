export class TranscriptionError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TranscriptionError';
      // Set the prototype explicitly.
      Object.setPrototypeOf(this, TranscriptionError.prototype);
    }
  }
