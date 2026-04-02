import "server-only";

/**
 * Redis helper template.
 *
 * To enable it:
 * 1. Install a Redis client such as `ioredis`
 * 2. Uncomment the import and client setup below
 * 3. Set `REDIS_URL` in your environment
 */

// import Redis from "ioredis";

// const globalForRedis = globalThis as typeof globalThis & {
//   redis?: Redis;
// };
//
// export const redis =
//   globalForRedis.redis ??
//   new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
//     lazyConnect: true,
//     maxRetriesPerRequest: 1,
//   });
//
// if (process.env.NODE_ENV !== "production") {
//   globalForRedis.redis = redis;
// }

export type RedisClient = unknown;

export const redis: RedisClient | null = null;
