import { unstable_cache } from 'next/cache';
import { Settings } from '@/lib/config/settings';

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
}

export function getCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}:${parts.join(':')}`;
}

export function createCachedFunction<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  options: CacheOptions = {}
) {
  if (!Settings.CACHE_ENABLED) {
    return fn;
  }

  const ttl = options.ttl || Settings.DEFAULT_CACHE_TTL;
  const tags = options.tags || keyParts;

  return unstable_cache(fn, keyParts, {
    revalidate: ttl,
    tags,
  });
}

