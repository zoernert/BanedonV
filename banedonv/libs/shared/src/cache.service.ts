import { createClient } from 'redis';
import { config } from './config';

const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

export class CacheService {
  async get(key: string): Promise<string | null> {
    return redisClient.get(key);
  }

  async set(key: string, value: string, expireInSeconds: number): Promise<void> {
    await redisClient.set(key, value, { EX: expireInSeconds });
  }
}
