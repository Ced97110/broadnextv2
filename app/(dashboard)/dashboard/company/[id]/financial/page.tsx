import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'd3-format';
import CompanyFinancials from './chart';
import { prepareData, prepareDataSentiment } from '@/app/data';
import { promise } from 'zod';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export default async function Financials ({params}:{params:{id:string}}) {

  console.log('params',params.id);

  const [financials, company] = await Promise.all([
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'FinancialCharts',
    }),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`
    ),

  ]);



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



    const cache = new Map();

    function generateCacheKey(prompt) {
        return  JSON.stringify(prompt);
    }

    async function getCompletion(prompt) {
        const key = generateCacheKey(prompt);
        if (cache.has(key)) {
            return cache.get(key);
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
        });

        cache.set(key, completion);
        return completion;
    }


    const [response0, response1, response2] = await Promise.all([
      getCompletion(prompt),
      getCompletion(prompt1),
      getCompletion(prompt2),
    ]);


  



    const summary = response0.choices[0].message.content.trim();
    const summary1 = response1.choices[0].message.content.trim();
    const summary2 = response2.choices[0].message.content.trim();


    

  

    return (
      <section>
        <CompanyFinancials data={data} raw={financials} company={company}  companyprompt={summary} companyprompt1={summary1} companyprompt2={summary2} />
      </section>
    )
}