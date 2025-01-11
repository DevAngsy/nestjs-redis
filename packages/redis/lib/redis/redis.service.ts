import { Injectable, Inject } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS_CLIENTS, DEFAULT_REDIS } from './redis.constants';
import { RedisClients } from './interfaces';
import { parseConnectionName } from '@/utils';
import { ConnectionName } from '@/interfaces';
import { ConnectionNotFoundError } from '@/errors';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENTS) private readonly clients: RedisClients) {}

  /**
   * Retrieves a redis connection by connection name.
   * However, if the retrieving does not find a connection, it returns ConnectionNotFoundError: No Connection found error.
   *
   * @param connectionName - Connection name
   * @returns A redis connection
   */
  getOrThrow(connectionName: ConnectionName = DEFAULT_REDIS): Redis {
    const connection = this.clients.get(connectionName);
    if (!connection) throw new ConnectionNotFoundError(parseConnectionName(connectionName));
    return connection;
  }

  /**
   * Retrieves a redis connection by connection name, if the retrieving does not find a connection, it returns `null`;
   *
   * @param connectionName - Connection name
   * @returns A redis connection or `null`(not found)
   */
  getOrNil(connectionName: ConnectionName = DEFAULT_REDIS): Redis | null {
    const connection = this.clients.get(connectionName);
    if (!connection) return null;
    return connection;
  }
}
