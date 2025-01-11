import { ClientNotFoundError } from './client-not-found.error';

describe('ClientNotFoundError', () => {
  test('should create an instance', () => {
    const e = new ClientNotFoundError('name');
    expect(e.name).toBe(ClientNotFoundError.name);
    expect(e.message).toContain('name');
    expect(e.stack).toBeString();
    expect(e).toBeInstanceOf(Error);
  });
});
