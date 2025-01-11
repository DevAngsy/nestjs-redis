/**
 * Thrown when async configurations are missing.
 */
export class MissingConfigurationsError extends Error {
  constructor() {
    super('Asynchronous configurations are missing, it can be one of: useFactory | useClass | useExisting.');
  }

  get name() {
    return this.constructor.name;
  }
}
