import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'd3-format';
import CompanyFinancials from './chart';
import { prepareData, prepareDataSentiment } from '@/app/data';
import { promise } from 'zod';
import OpenAI from 'openai';
import { createClient } from 'redis';
import { getRedisClient } from './redis';
import crypto from 'crypto';
import { getAccessToken } from '@auth0/nextjs-auth0';


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

export  async function cacheResponse(cacheKey, data, ttl = 3600) {
  const redisClient = await getRedisClient();
  await redisClient.set(cacheKey, JSON.stringify(data), {
    EX: ttl, // Set the expiration time in seconds
  });
}

export function generateCacheKey(prompt) {
  const keyData = JSON.stringify({ prompt });
  return crypto.createHash('sha256').update(keyData).digest('hex');
}


export default async function Financials ({params}:{params:{id:string}}) {

  console.log('params',params.id);


  const { accessToken } = await getAccessToken();

  const [financials, company] = await Promise.all([
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'FinancialCharts',
      token: accessToken
    }),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`,
      accessToken

    ),

  ]);




    const merged = {...financials, ...company}

    const prompt = `
      ${JSON.stringify(merged, null, 2)}
      Financial Health of the Company

      Based on the latest financial data, analyze the financial health of the company by evaluating its liquidity, solvency, and profitability. Specifically, consider the following metrics:

      Current ratio
      Quick ratio
      Debt to equity ratio
      Net profit margin
      Return on equity (ROE)

      What do these metrics indicate about the company's financial health? Are there any areas of concern or opportunities for improvement?
    

    `;


      const prompt1 = `
      ${JSON.stringify(merged, null, 2)}
      Challenges Faced by the Business and Risks

      Analyze the company's financial data to identify potential challenges and risks facing the business. Consider the following metrics:

      Revenue growth rate
      Gross margin
      Operating margin
      Interest coverage ratio
      Asset turnover

      What do these metrics suggest about the company's competitive position and potential risks? Are there any areas where the company may be vulnerable to disruption or competition?

      `;



      const prompt2 = `
      ${JSON.stringify(merged, null, 2)}
      Valuation Ratios and Fair Value

      Analyze the company's valuation ratios to determine if it is fairly valued by the market. Consider the following metrics:

      Price to earnings (P/E) ratio: 25x (vs. industry average of 20x)
      Price to book (P/B) ratio: 3.5x (vs. industry average of 2.5x)
      Dividend yield: 2% (vs. industry average of 3%)

      What do these metrics suggest about the company's valuation? Is the company overvalued, undervalued, or fairly valued by the market? What are the implications for investors?

      `;


      const paramsForOpenAI = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      };





   const quarters = financials.Results?.find(item => item.Label === 'QUARTER')?.Results || [];

   console.log('QUARTERS',quarters);

   
   const data = quarters.map((quarter,index) => {
    const row = {Quarter: quarter}
    financials.Results?.forEach(({Label,Results,ChartType}) => {
      if(Label !== 'QUARTER') {
        row[Label] = Results[index]
        row['ChartType'] = ChartType
      }
    })
    return row
   })




  const [response, responsePrompt1, responsePrompt2] = await Promise.all([

    getOpenAIResponse(prompt),
    getOpenAIResponse(prompt1),
    getOpenAIResponse(prompt2)

  ]);


  const summary = response.choices[0].message.content.trim(); 
  const summary1 = responsePrompt1.choices[0].message.content.trim(); 
  const summary2 = responsePrompt2.choices[0].message.content.trim(); 

  console.log('OpenAI Response:', response);
  console.error('Error fetching OpenAI response:');

    return (
      <section>
        <CompanyFinancials data={data} raw={financials} company={company}  companyprompt={summary} companyprompt1={summary1} companyprompt2={summary2} />
      </section>
    )
}



export async function getOpenAIResponse(prompt, ttl = 3600) {
  const cacheKey = generateCacheKey(prompt);
  const cachedResponse = await getCachedResponse(cacheKey);


  if (cachedResponse) {
    return cachedResponse;
  } else {
    try {
      const response = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
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


