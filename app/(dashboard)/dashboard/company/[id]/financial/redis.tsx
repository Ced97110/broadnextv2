
import { createClient } from 'redis';

let redisClient;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      // Specify the URL; use '127.0.0.1' to force IPv4
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    await redisClient.connect();
  } else if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}