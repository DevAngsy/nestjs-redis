import { Inject } from '@nestjs/common';
import { DEFAULT_REDIS, MODULE_ID } from '../redis.constants';
import { Namespace } from '@/interfaces';
import { isString } from '@/utils';

/**
 * This decorator is used to mark a specific constructor parameter as a redis client.
 *
 * @param namespace - Client namespace
 */
export const InjectRedis = (namespace: Namespace = DEFAULT_REDIS): ReturnType<typeof Inject> => {
  const token = getRedisToken(namespace);
  return Inject(token);
};

/**
 * Generates an injection token for a redis client.
 *
 * @param namespace - Client namespace
 * @returns The final token
 */
export const getRedisToken = (namespace: Namespace): Namespace => {
  if (isString(namespace)) return `${MODULE_ID}:${namespace}`;
  return namespace;
};
