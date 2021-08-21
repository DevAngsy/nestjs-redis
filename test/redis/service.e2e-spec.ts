import { Test } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import { RedisClients } from '../../lib/redis/interfaces';
import { REDIS_CLIENTS } from '../../lib/redis/redis.constants';
import { quitClients } from '../../lib/redis/common';

let clients: RedisClients;

let app: NestFastifyApplication;

afterAll(async () => {
    await quitClients(clients);

    await app.close();
});

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
    }).compile();

    clients = moduleRef.get<RedisClients>(REDIS_CLIENTS);

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await app.getHttpAdapter().getInstance().ready();
});

test('/service/client0 (GET)', async () => {
    const res = await app.inject({ method: 'GET', url: '/service/client0' });

    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('PONG');
});

test('/service/default (GET)', async () => {
    const res = await app.inject({ method: 'GET', url: '/service/default' });

    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('PONG');
});
