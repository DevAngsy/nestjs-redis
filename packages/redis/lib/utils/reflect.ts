/**
 * Equivalent to `Reflect.get()`.
 *
 * @param target - An object
 * @param key - The property name
 * @returns An unknown value
 */
export const get = <T>(target: object, key: PropertyKey) => Reflect.get(target, key) as T;
