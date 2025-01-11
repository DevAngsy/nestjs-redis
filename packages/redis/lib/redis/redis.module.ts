import { Module, DynamicModule } from '@nestjs/common';
import { RedisModuleOptions, RedisModuleAsyncOptions, ExtraRedisModuleOptions } from './interfaces';
import { ConnectionName } from '@/interfaces';
import { RedisCoreModule } from './redis-core.module';

@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions = {}, extra: ExtraRedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRoot(options, extra)]
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions, extra: ExtraRedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(options, extra)]
    };
  }

  static forFeature(connectionNames: ConnectionName[], isGlobal = true): DynamicModule {
    return {
      global: isGlobal,
      module: RedisModule,
      providers: [],
      exports: []
    };
  }
}
