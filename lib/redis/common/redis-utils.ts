import IORedis, { Redis } from 'ioredis';
import { ClientOptions, RedisClients } from '../interfaces';

export const createClient = (options: ClientOptions): Redis => {
    const { url, onClientCreated, ...redisOptions } = options;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(redisOptions);

    if (onClientCreated) onClientCreated(client);

    return client;
};

export const quitClients = (clients: RedisClients): void => {
    clients.forEach(client => {
        if (client.status !== 'end') void client.quit();
    });
};
