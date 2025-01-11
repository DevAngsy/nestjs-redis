import { Module, DynamicModule, Provider, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisClients, ExtraRedisModuleOptions } from './interfaces';
import { RedisService } from './redis.service';
import {
  createOptionsProvider,
  createAsyncProviders,
  redisClientsProvider,
  mergedOptionsProvider
} from './redis.providers';
import { REDIS_CLIENTS, REDIS_MERGED_OPTIONS } from './redis.constants';
import { isError } from '@/utils';
import { logger } from './redis-logger';
import { MissingConfigurationsError } from '@/errors';
import { generateErrorMessage } from '@/messages';
import { removeListeners } from './common';
import { defaultExtraRedisModuleOptions } from './defaults';

@Module({})
export class RedisCoreModule implements OnApplicationShutdown {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * Registers the module synchronously.
   *
   * @param options - The module options
   * @param isGlobal - Whether to register in the global scope
   * @returns A DynamicModule
   */
  static forRoot(options: RedisModuleOptions = {}, extra: ExtraRedisModuleOptions): DynamicModule {
    const extraOptions: ExtraRedisModuleOptions = { ...defaultExtraRedisModuleOptions, ...extra };
    const providers: Provider[] = [
      createOptionsProvider(options),
      redisClientsProvider,
      mergedOptionsProvider,
      RedisService
    ];

    return {
      global: extraOptions.isGlobal,
      module: RedisCoreModule,
      providers,
      exports: [RedisService]
    };
  }

  /**
   * Registers the module asynchronously.
   *
   * @param options - The async module options
   * @param isGlobal - Whether to register in the global scope
   * @returns A DynamicModule
   */
  static forRootAsync(options: RedisModuleAsyncOptions, extra: ExtraRedisModuleOptions): DynamicModule {
    if (!options.useFactory && !options.useClass && !options.useExisting) {
      throw new MissingConfigurationsError();
    }
    const extraOptions: ExtraRedisModuleOptions = { ...defaultExtraRedisModuleOptions, ...extra };

    const providers: Provider[] = [
      ...createAsyncProviders(options),
      redisClientsProvider,
      mergedOptionsProvider,
      RedisService,
      ...(options.extraProviders ?? [])
    ];

    return {
      global: extraOptions.isGlobal,
      module: RedisCoreModule,
      imports: options.imports,
      providers,
      exports: [RedisService]
    };
  }

  async onApplicationShutdown() {
    const { closeClient } = this.moduleRef.get<RedisModuleOptions>(REDIS_MERGED_OPTIONS, { strict: false });
    if (!closeClient) return;
    const clients = this.moduleRef.get<RedisClients>(REDIS_CLIENTS, { strict: false });
    for (const [namespace, client] of clients) {
      try {
        if (client.status === 'end') continue;
        await client.quit();
      } catch (e) {
        if (isError(e)) logger.error(generateErrorMessage(namespace, e.message), e.stack);
      } finally {
        removeListeners(client);
      }
    }
  }
}
