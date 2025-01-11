import { RedisModuleOptions, ExtraRedisModuleOptions } from './interfaces';

export const defaultRedisModuleOptions: RedisModuleOptions = {
  closeClient: true,
  commonOptions: undefined,
  readyLog: true,
  errorLog: true,
  config: {}
};

export const defaultExtraRedisModuleOptions: ExtraRedisModuleOptions = {
  isGlobal: true,
  loggerContext: 'RedisModule',
  loggerTimestamp: true
};
