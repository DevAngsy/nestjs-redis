import { MissingConfigurationsError } from './missing-configurations.error';

describe('MissingConfigurationsError', () => {
  test('should create an instance', () => {
    const e = new MissingConfigurationsError();
    expect(e.name).toBe(MissingConfigurationsError.name);
    expect(e.message).toBeString();
    expect(e.stack).toBeString();
    expect(e).toBeInstanceOf(Error);
  });
});
