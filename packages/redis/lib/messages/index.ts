import { Namespace } from '@/interfaces';
import { parseNamespace } from '@/utils';

export const generateReadyMessage = (namespace: Namespace) => {
  return `${parseNamespace(namespace)}: the connection was successfully established`;
};

export const generateErrorMessage = (namespace: Namespace, message: string) => {
  return `${parseNamespace(namespace)}: ${message}`;
};
