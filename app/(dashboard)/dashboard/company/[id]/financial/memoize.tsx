

import OpenAI from 'openai';
import { kv } from '@vercel/kv';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function getCachedResponse(cacheKey) {
  const cachedData = await kv.get(cacheKey);

  if (cachedData) {
    console.log('Cache hit');
    try {
      return JSON.parse(cachedData as string); // Ensure cachedData is parsed correctly
    } catch (error) {
      console.error("Failed to parse cached data:", error);
      return null; // Return null if parsing fails
    }
  }
  
  console.log('Cache miss');
  return null;
}

export async function cacheResponse(cacheKey, data, ttl = 3600) {
  try {
    const jsonData = JSON.stringify(data); // Properly stringify the data
    await kv.set(cacheKey, jsonData, { ex: ttl });
  } catch (error) {
    console.error("Failed to cache response:", error);
  }
}

export async function generateCacheKey(prompt) {
  const keyData = JSON.stringify({ prompt });
  const encoder = new TextEncoder();
  const data = encoder.encode(keyData);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Using Web Crypto API
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Convert bytes to hex string
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


export async function getOpenAIResponseBatch(prompts, ttl = 3600) {

  const results = await Promise.all(
    prompts.map(async (prompt) => {
      const cacheKey = await generateCacheKey(prompt); // Await for the promise here
      const cachedResponse = await getCachedResponse(cacheKey);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }], // Send each prompt individually
          max_tokens: 300,
        });

        await cacheResponse(cacheKey, response, ttl);
        return response;
      } catch (error) {
        console.error('Error fetching OpenAI response for prompt:', prompt, error);
        return null;
      }
    })
  );

  console.log('OpenAI responses:', results);

  return results; // Array of responses for each prompt
}