import React, { useEffect, useMemo, useState } from 'react';
import CompanyFinancials from './chart';
import { cookies } from 'next/headers';
import { processFinancials } from '@/lib/process-financials';
import { getOpenAIResponse } from './memoize';
import { prepareData, prepareDataSentiment } from '@/lib/data';



export default async function Financials ({params}:{params:{id:string}}) {

  console.log('params',params.id);

  const cookieStore = cookies();
  const accessToken = cookieStore.get('appSession');

  const [financials, company] = await Promise.all([
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'FinancialCharts',
      token: accessToken.value
    }),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`,
      accessToken.value

    ),

  ]);

  const data = await processFinancials(financials);

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


