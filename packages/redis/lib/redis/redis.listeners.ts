import type { Redis } from 'ioredis';
import { Namespace } from '@/interfaces';

export function readyListener(this: Redis) {
  logger.log(generateReadyMessage(get<Namespace>(this, NAMESPACE_KEY)));
}

export function errorListener(this: Redis, error: Error) {
  logger.error(generateErrorMessage(get<Namespace>(this, NAMESPACE_KEY), error.message), error.stack);
}
