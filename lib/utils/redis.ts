import { Settings } from '@/lib/config/settings';

let redisClient: any = null;

export async function getRedisClient() {
  if (!Settings.REDIS_URL) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({
      url: Settings.REDIS_URL,
      token: process.env.REDIS_TOKEN || '',
    });
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
    return null;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (!Settings.CACHE_ENABLED) {
    return null;
  }

  const client = await getRedisClient();
  if (!client) {
    return null;
  }

  try {
    const value = await client.get(key);
    return value as T | null;
  } catch (error) {
    console.error(`Redis get error for key ${key}:`, error);
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = Settings.DEFAULT_CACHE_TTL
): Promise<boolean> {
  if (!Settings.CACHE_ENABLED) {
    return false;
  }

  const client = await getRedisClient();
  if (!client) {
    return false;
  }

  try {
    await client.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Redis set error for key ${key}:`, error);
    return false;
  }
}

export async function deleteCache(key: string): Promise<boolean> {
  const client = await getRedisClient();
  if (!client) {
    return false;
  }

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error(`Redis delete error for key ${key}:`, error);
    return false;
  }
}

