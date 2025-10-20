import { configDotenv } from 'dotenv';
import { Redis } from 'ioredis';

configDotenv();
export const redisConnection = new Redis(process.env.REDIS_URL || '');
