import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ClusterModule } from '@/.';
import { RedisHealthModule } from '@/health';
import { HealthController } from './controllers/health.controller';
import { InjectController } from './controllers/inject.controller';
import { ServiceController } from './controllers/service.controller';

@Module({
    imports: [
        ClusterModule.forRootAsync({
            useFactory() {
                return {
                    closeClient: true,
                    config: [
                        {
                            nodes: [{ host: '127.0.0.1', port: 16380 }],
                            options: { redisOptions: { password: 'clusterpassword1' } }
                        },
                        {
                            namespace: 'client1',
                            nodes: [{ host: '127.0.0.1', port: 16480 }],
                            options: { redisOptions: { password: 'clusterpassword2' } }
                        }
                    ]
                };
            }
        }),
        TerminusModule,
        RedisHealthModule
    ],
    controllers: [HealthController, InjectController, ServiceController]
})
export class AppModule {}
