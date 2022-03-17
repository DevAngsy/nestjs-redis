<p align="center">
<a href="https://nestjs.com/">
<img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
</a>
</p>

<p align="center">
Redis(<a href="https://github.com/luin/ioredis">ioredis</a>) module for NestJS framework.
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@liaoliaots/nestjs-redis">
<img src="https://img.shields.io/npm/v/@liaoliaots/nestjs-redis?style=for-the-badge" alt="NPM Version" />
</a>
<a href="https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE">
<img src="https://img.shields.io/npm/l/@liaoliaots/nestjs-redis?style=for-the-badge" alt="Package License" />
</a>
<a href="#">
<img src="https://img.shields.io/npm/dm/@liaoliaots/nestjs-redis?style=for-the-badge" alt="NPM Downloads" />
</a>
<a href="#">
<img src="https://img.shields.io/snyk/vulnerabilities/npm/@liaoliaots/nestjs-redis?style=for-the-badge" alt="Package Vulnerabilities" />
</a>
</p>

<p align="center">
<a href="https://github.com/liaoliaots/nestjs-redis/actions/workflows/testing.yml">
<img src="https://github.com/liaoliaots/nestjs-redis/actions/workflows/testing.yml/badge.svg" />
</a>
</p>

## Features 🚀

-   **Both redis & cluster are supported**: You can also specify multiple clients.
-   **Health**: Checks health of redis & cluster server.
-   **Rigorously tested**: With 130+ tests and 100% code coverage.
-   **Decorators**: Injects redis/cluster client via `@InjectRedis()` and `@InjectCluster()`.
-   **Services**: Retrieves redis/cluster client via `RedisService` and `ClusterService`.

## Test coverage 🧐

| Statements                                                                                      | Branches                                                                                    | Functions                                                                                     | Lines                                                                                 |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat-square) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat-square) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat-square) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat-square) |

## Documentation

-   [Install](#install)
-   [Redis](docs/latest/redis.md)
    -   [Non-global](docs/latest/redis.md#non-global)
-   [Cluster](docs/latest/cluster.md)
    -   [Non-global](docs/latest/cluster.md#non-global)
-   [Health Checks](docs/latest/health-checks.md)
-   [Examples](docs/latest/examples.md)
    -   [Redis Sentinel](docs/latest/examples.md#sentinel)
    -   [Multiple Cluster Clients](docs/latest/examples.md#multiple-clients)
-   [Test a class](#test-a-class)
-   [Future](#future)
-   [Package dependency overview](#package-dependency-overview)

### Deprecated

-   v5, [click here](docs/v5)
-   v6, [click here](docs/v6)

## Install

**This package supports both nestjs 7.x and 8.x**.

```sh
$ npm install --save @liaoliaots/nestjs-redis ioredis
$ npm install --save-dev @types/ioredis
```

```sh
$ yarn add @liaoliaots/nestjs-redis ioredis
$ yarn add --dev @types/ioredis
```

## Test a class

This package exports `getRedisToken()` and `getClusterToken()` functions that return an internal injection token based on the provided context. Using this token, you can provide a mock implementation of the redis/cluster client using any of the standard custom provider techniques, including `useClass`, `useValue`, and `useFactory`.

```TypeScript
const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: getRedisToken('your namespace'), useValue: mockClient }, YourService]
}).compile();
```

A working example is available [here](sample/01-testing-inject).

## Future

1.  -   [ ] COMMAND: SELECT
2.  -   [ ] Microservice strategy

## Package dependency overview

![](docs/latest/dependency-graph.svg)

## Author

👤 **LiaoLiao**

-   Github: [@liaoliaots](https://github.com/liaoliaots)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/liaoliaots/nestjs-redis/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE) licensed.
