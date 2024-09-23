


import crypto from 'crypto';
import { getRedisClient } from './redis'; // Assuming you have a redis helper
import OpenAI from 'openai';



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getCachedResponse(cacheKey) {
  const redisClient = await getRedisClient();
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    console.log('Cache hit');
    return JSON.parse(cachedData);
  }
  console.log('Cache miss');
  return null;
}

export async function cacheResponse(cacheKey, data, ttl = 3600) {
  const redisClient = await getRedisClient();
  await redisClient.set(cacheKey, JSON.stringify(data), {
    EX: ttl, // Set the expiration time in seconds
  });
}

export function generateCacheKey(prompt) {
  const keyData = JSON.stringify({ prompt });
  return crypto.createHash('sha256').update(keyData).digest('hex');
}

export async function getOpenAIResponse(prompt, ttl = 3600) {
  const cacheKey = generateCacheKey(prompt);
  const cachedResponse = await getCachedResponse(cacheKey);

  if (cachedResponse) {
    return cachedResponse;
  } else {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      });

      await cacheResponse(cacheKey, response, ttl);
      return response;
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      return null;
    }
  }
}


