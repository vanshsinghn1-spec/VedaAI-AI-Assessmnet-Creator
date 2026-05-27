import Redis from 'ioredis';
import { config } from './env';

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!redis && config.redisUrl) {
    try {
      redis = new Redis(config.redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        tls: config.redisUrl.startsWith('rediss://') ? {} : undefined,
        retryStrategy(times: number) {
          if (times > 5) return null; // Stop retrying after 5 attempts
          const delay = Math.min(times * 500, 5000);
          return delay;
        },
      });

      redis.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      redis.on('error', (err) => {
        console.error('❌ Redis error:', err.message);
      });
    } catch (error) {
      console.warn('⚠️  Redis connection failed. Caching disabled.');
      redis = null;
    }
  }
  return redis;
}

// Create a separate connection for BullMQ (it needs its own)
export function createBullMQConnection(): Redis | null {
  if (!config.redisUrl) return null;
  try {
    return new Redis(config.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      tls: config.redisUrl.startsWith('rediss://') ? {} : undefined,
    });
  } catch {
    return null;
  }
}
