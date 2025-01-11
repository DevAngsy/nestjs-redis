/**
 * Thrown when consumer tries to get client that does not exist.
 */
export class ClientNotFoundError extends Error {
  constructor(namespace: string) {
    super(`Client "${namespace}" was not found.`);
  }

  get name() {
    return this.constructor.name;
  }
}
