import React from 'react'
import { Chat } from '../financial/chat'
import { getAccessToken } from '@auth0/nextjs-auth0';
import { cookies } from 'next/headers';
import { prepareData, prepareDataSentiment } from '@/lib/data';


export const runtime = 'edge';

export default async function Copilot ({params}:{params:{id:string}}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('appSession');

  const [financials, company,newsData,relation,entities,positiveSentiment,negativeSentiment,sentimentSeries] = await Promise.all([
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'FinancialCharts',
    }),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`,
      accessToken.value
    ),
    prepareData(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/News?CompanyId=${params.id}`,accessToken.value),
    prepareData(
      `https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/Relations?CompanyId=${params.id}`,
      accessToken.value
    ),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'Entities',
      SignalSource: '1',
      token: accessToken.value
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '1',
      endpoint: 'Entities',
      SignalSource: '1',
      token: accessToken.value
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '2',
      endpoint: 'Entities',
      SignalSource: '1',
      token: accessToken.value
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'SentimenSeries',
      SignalSource: '1',
      token: accessToken.value
    }),
  ]);


  const sentimentSeriesRecharts = sentimentSeries?.map(item => {
    const transformedItem = {
      Date: new Date(item.Date).toLocaleDateString(),
      Positive: item.PositiveScore,
      Negative: item.NegativeScore,
    };
    return transformedItem;
  }
  );


  const allSentimentSeriesRechart = entities.slice(0,2).map((item) => {
    const transformedItem = {
      EntityName: item.EntityName,
      Positive: item.PositiveScore,
      Negative: item.NegativeScore,
      
    }
    return transformedItem;
  }
  );

  const positivesRechart = positiveSentiment?.slice(0,2).map((item) => {
    const transformedItem = {
      EntityName: item.EntityName,
      Positive: item.OccurenceRatio,
    }

    return transformedItem;

  })


  const negativeRechart = negativeSentiment?.slice(0,2).map((item) => {
    const transformedItem = {
      EntityName: item.EntityName,
      Negative: item.OccurenceRatio,
    }

    return transformedItem;

  })



    
  return (
    <section className='flex flex-col space-y-12 p-2 relative'>
       <Chat endpoint='copilot' financial={financials} sentimentSeries={ sentimentSeriesRecharts } positiveSentiment={positivesRechart} negativeSentiment={negativeRechart} news={newsData.Results} company={company} relation={relation} entities={allSentimentSeriesRechart } />
    </section>
  )
}
