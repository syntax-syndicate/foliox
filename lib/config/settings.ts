import { z } from 'zod';

const envSchema = z.object({
  GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required'),
  GITHUB_TOKEN: z.string().optional(),
  API_KEYS: z.string().min(1, 'API_KEYS is required'),
  CACHE_ENABLED: z.string().default('true').transform(val => val === 'true'),
  DEFAULT_CACHE_TTL: z.string().default('3600').transform(val => parseInt(val, 10)),
  REDIS_URL: z.string().optional(),
  DEBUG: z.string().default('false').transform(val => val === 'true'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse({
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      API_KEYS: process.env.API_KEYS,
      CACHE_ENABLED: process.env.CACHE_ENABLED,
      DEFAULT_CACHE_TTL: process.env.DEFAULT_CACHE_TTL,
      REDIS_URL: process.env.REDIS_URL,
      DEBUG: process.env.DEBUG,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Environment validation failed:\n${missingVars}`);
    }
    throw error;
  }
}

const env = validateEnv();

export const Settings = {
  GROQ_API_KEY: env.GROQ_API_KEY,
  GITHUB_TOKEN: env.GITHUB_TOKEN,
  API_KEYS: env.API_KEYS.split(',').map(key => key.trim()),
  CACHE_ENABLED: env.CACHE_ENABLED,
  DEFAULT_CACHE_TTL: env.DEFAULT_CACHE_TTL,
  REDIS_URL: env.REDIS_URL,
  DEBUG: env.DEBUG,
  NODE_ENV: env.NODE_ENV,
} as const;

