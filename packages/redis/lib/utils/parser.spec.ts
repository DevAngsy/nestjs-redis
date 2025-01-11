import { parseNamespace } from './parser';

describe('parseNamespace', () => {
  test('should return a string', () => {
    const name1 = '1';
    const name2 = Symbol('2');
    expect(parseNamespace(name1)).toBe(name1);
    expect(parseNamespace(name2)).toBe(name2.toString());
  });
});
