import { Logger } from '@nestjs/common';
import IORedis, { Cluster } from 'ioredis';
import allSettled, { PromiseResult } from 'promise.allsettled';
import { ClusterClientOptions, ClusterClients } from '../interfaces';
import { CLUSTER_MODULE_ID, ClusterStatus } from '../cluster.constants';
import { parseNamespace } from '@/utils';
import { ClientNamespace } from '@/interfaces';
import { CONNECTED_SUCCESSFULLY } from '@/messages';

export const logger = new Logger(CLUSTER_MODULE_ID);

export const createClient = (clientOptions: ClusterClientOptions): Cluster => {
    const { nodes, options, onClientCreated } = clientOptions;

    const client = new IORedis.Cluster(nodes, options);
    if (onClientCreated) onClientCreated(client);

    return client;
};

export const displayReadyLog = (clients: ClusterClients): void => {
    clients.forEach((client, namespace) => {
        client.once(ClusterStatus.READY, () => {
            logger.log(`${parseNamespace(namespace)}: ${CONNECTED_SUCCESSFULLY}`);
        });
    });
};

export const quitClients = async (
    clients: ClusterClients
): Promise<[PromiseResult<ClientNamespace>, PromiseResult<'OK'>][]> => {
    const promises: Promise<[PromiseResult<ClientNamespace>, PromiseResult<'OK'>]>[] = [];
    clients.forEach((client, namespace) => {
        if (client.status === ClusterStatus.READY) {
            promises.push(allSettled([Promise.resolve(namespace), client.quit()]));
            return;
        }
        client.disconnect();
    });

    return await Promise.all(promises);
};
