import { isString } from './is';
import { Namespace } from '@/interfaces';

/**
 * Parses namespace to string.
 *
 * @param namespace - Name of the client connection
 * @returns A string value
 */
export const parseNamespace = (namespace: Namespace): string => {
  return isString(namespace) ? namespace : namespace.toString();
};
