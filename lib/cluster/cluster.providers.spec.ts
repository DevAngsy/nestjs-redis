import { Test, TestingModule } from '@nestjs/testing';
import IORedis, { Cluster } from 'ioredis';
import {
    createOptionsProvider,
    createAsyncProviders,
    createAsyncOptionsProvider,
    clusterClientsProvider,
    createClusterClientProviders,
    createAsyncOptions
} from './cluster.providers';
import { ClusterOptionsFactory, ClusterModuleAsyncOptions, ClusterClients, ClusterModuleOptions } from './interfaces';
import { CLUSTER_OPTIONS, CLUSTER_CLIENTS, DEFAULT_CLUSTER_NAMESPACE } from './cluster.constants';
import { namespaces, displayReadyLog } from './common';
import { ClusterManager } from './cluster-manager';

jest.mock('ioredis');
jest.mock('./common', () => ({
    __esModule: true,
    ...jest.requireActual('./common'),
    displayReadyLog: jest.fn()
}));

const clusterOptions: ClusterModuleOptions = { config: { nodes: [] } };
class ClusterConfigService implements ClusterOptionsFactory {
    createClusterOptions(): ClusterModuleOptions {
        return clusterOptions;
    }
}

describe('createOptionsProvider', () => {
    test('should work correctly', () => {
        expect(createOptionsProvider(clusterOptions)).toEqual({
            provide: CLUSTER_OPTIONS,
            useValue: clusterOptions
        });
    });
});

describe('createAsyncProviders', () => {
    test('should work correctly', () => {
        expect(createAsyncProviders({ useFactory: () => clusterOptions, inject: [] })).toHaveLength(1);
        expect(createAsyncProviders({ useClass: ClusterConfigService })).toHaveLength(2);
        expect(createAsyncProviders({ useExisting: ClusterConfigService })).toHaveLength(1);
        expect(createAsyncProviders({})).toHaveLength(0);
    });
});

describe('createAsyncOptions', () => {
    test('should work correctly', async () => {
        const clusterConfigService: ClusterOptionsFactory = {
            createClusterOptions() {
                return { config: { nodes: [] } };
            }
        };
        await expect(createAsyncOptions(clusterConfigService)).resolves.toEqual({ config: { nodes: [] } });
    });
});

describe('createAsyncOptionsProvider', () => {
    test('should create provider with useFactory', () => {
        const options: ClusterModuleAsyncOptions = { useFactory: () => clusterOptions, inject: ['token'] };
        expect(createAsyncOptionsProvider(options)).toEqual({ provide: CLUSTER_OPTIONS, ...options });
    });

    test('should create provider with useClass', () => {
        const options: ClusterModuleAsyncOptions = { useClass: ClusterConfigService };
        expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', CLUSTER_OPTIONS);
        expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
        expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [ClusterConfigService]);
    });

    test('should create provider with useExisting', () => {
        const options: ClusterModuleAsyncOptions = { useExisting: ClusterConfigService };
        expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', CLUSTER_OPTIONS);
        expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
        expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [ClusterConfigService]);
    });

    test('should create provider without options', () => {
        expect(createAsyncOptionsProvider({})).toEqual({ provide: CLUSTER_OPTIONS, useValue: {} });
    });
});

describe('clusterClientsProvider', () => {
    describe('with multiple clients', () => {
        let clients: ClusterClients;
        let manager: ClusterManager;

        beforeEach(async () => {
            const options: ClusterModuleOptions = {
                config: [
                    {
                        nodes: []
                    },
                    {
                        namespace: 'client1',
                        nodes: []
                    }
                ]
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: CLUSTER_OPTIONS, useValue: options }, clusterClientsProvider, ClusterManager]
            }).compile();

            clients = module.get<ClusterClients>(CLUSTER_CLIENTS);
            manager = module.get<ClusterManager>(ClusterManager);
        });

        test('should have 2 members', () => {
            expect(clients.size).toBe(2);
        });

        test('should work correctly', () => {
            let client: Cluster;
            client = manager.getClient(DEFAULT_CLUSTER_NAMESPACE);
            expect(client).toBeInstanceOf(IORedis.Cluster);
            client = manager.getClient('client1');
            expect(client).toBeInstanceOf(IORedis.Cluster);
        });
    });

    describe('with a single client and no namespace', () => {
        let clients: ClusterClients;
        let manager: ClusterManager;

        beforeEach(async () => {
            const options: ClusterModuleOptions = {
                config: {
                    nodes: []
                }
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: CLUSTER_OPTIONS, useValue: options }, clusterClientsProvider, ClusterManager]
            }).compile();

            clients = module.get<ClusterClients>(CLUSTER_CLIENTS);
            manager = module.get<ClusterManager>(ClusterManager);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should work correctly', () => {
            const client = manager.getClient(DEFAULT_CLUSTER_NAMESPACE);
            expect(client).toBeInstanceOf(IORedis.Cluster);
        });
    });

    describe('with a single client and namespace', () => {
        let clients: ClusterClients;
        let manager: ClusterManager;

        beforeEach(async () => {
            const options: ClusterModuleOptions = {
                config: {
                    namespace: 'client1',
                    nodes: []
                }
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: CLUSTER_OPTIONS, useValue: options }, clusterClientsProvider, ClusterManager]
            }).compile();

            clients = module.get<ClusterClients>(CLUSTER_CLIENTS);
            manager = module.get<ClusterManager>(ClusterManager);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should work correctly', () => {
            const client = manager.getClient('client1');
            expect(client).toBeInstanceOf(IORedis.Cluster);
        });
    });

    describe('displayReadyLog', () => {
        beforeEach(() => {
            (displayReadyLog as jest.MockedFunction<typeof displayReadyLog>).mockReset();
        });

        test('multiple clients', () => {
            const options: ClusterModuleOptions = {
                readyLog: true,
                config: [
                    {
                        nodes: []
                    },
                    {
                        namespace: 'client1',
                        nodes: []
                    }
                ]
            };
            clusterClientsProvider.useFactory(options);
            expect(displayReadyLog).toHaveBeenCalledTimes(1);
        });

        test('single client', () => {
            const options: ClusterModuleOptions = {
                readyLog: true,
                config: {
                    nodes: []
                }
            };
            clusterClientsProvider.useFactory(options);
            expect(displayReadyLog).toHaveBeenCalledTimes(1);
        });
    });
});

describe('createClusterClientProviders', () => {
    let clients: ClusterClients;
    let client1: Cluster;
    let client2: Cluster;

    beforeEach(async () => {
        clients = new Map();
        clients.set('client1', new IORedis.Cluster([]));
        clients.set('client2', new IORedis.Cluster([]));
        namespaces.set('client1', 'client1');
        namespaces.set('client2', 'client2');

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: CLUSTER_CLIENTS, useValue: clients },
                ClusterManager,
                ...createClusterClientProviders()
            ]
        }).compile();

        client1 = module.get<Cluster>('client1');
        client2 = module.get<Cluster>('client2');
    });

    test('should work correctly', () => {
        expect(client1).toBeInstanceOf(IORedis.Cluster);
        expect(client2).toBeInstanceOf(IORedis.Cluster);
    });
});
