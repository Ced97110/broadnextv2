import React from 'react'
import { Chat } from '../financial/chat'
import { prepareData, prepareDataSentiment } from '@/lib/data';

export const runtime = 'edge';


export default async function Copilot({ params }: { params: { id: string } }) {
 

  // Use Promise.allSettled to handle errors for each request
  const results = await Promise.allSettled([
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'FinancialCharts',
    }, ),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`,
    
      
    ),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/News?CompanyId=${params.id}`,
     
      
    ),
    prepareData(
      `https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/Relations?CompanyId=${params.id}`,
     
      
    ),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'Entities',
      SignalSource: '1',
      
    }, ),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '1',
      endpoint: 'Entities',
      SignalSource: '1',
      
    }, ),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '2',
      endpoint: 'Entities',
      SignalSource: '1',
      
    }, ),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'SentimenSeries',
      SignalSource: '1',
      
    }, ),
  ]);

  // Destructure the results of each Promise.allSettled call
  const [financialsResult, companyResult, newsDataResult, relationResult, entitiesResult, positiveSentimentResult, negativeSentimentResult, sentimentSeriesResult] = results;

  // Handle each result by checking if it was fulfilled or rejected
  const financials = financialsResult.status === 'fulfilled' ? financialsResult.value : null;
  const company = companyResult.status === 'fulfilled' ? companyResult.value : null;
  const newsData = newsDataResult.status === 'fulfilled' ? newsDataResult.value : null;
  const relation = relationResult.status === 'fulfilled' ? relationResult.value : null;
  const entities = entitiesResult.status === 'fulfilled' ? entitiesResult.value : [];
  const positiveSentiment = positiveSentimentResult.status === 'fulfilled' ? positiveSentimentResult.value : [];
  const negativeSentiment = negativeSentimentResult.status === 'fulfilled' ? negativeSentimentResult.value : [];
  const sentimentSeries = sentimentSeriesResult.status === 'fulfilled' ? sentimentSeriesResult.value : [];

  // Log errors for rejected promises
  if (financialsResult.status === 'rejected') console.error('Error fetching financials:', financialsResult.reason);
  if (companyResult.status === 'rejected') console.error('Error fetching company:', companyResult.reason);
  if (newsDataResult.status === 'rejected') console.error('Error fetching news:', newsDataResult.reason);
  if (relationResult.status === 'rejected') console.error('Error fetching relations:', relationResult.reason);
  if (entitiesResult.status === 'rejected') console.error('Error fetching entities:', entitiesResult.reason);
  if (positiveSentimentResult.status === 'rejected') console.error('Error fetching positive sentiment:', positiveSentimentResult.reason);
  if (negativeSentimentResult.status === 'rejected') console.error('Error fetching negative sentiment:', negativeSentimentResult.reason);
  if (sentimentSeriesResult.status === 'rejected') console.error('Error fetching sentiment series:', sentimentSeriesResult.reason);

  // Transform sentiment data for charts
  const sentimentSeriesRecharts = sentimentSeries?.map(item => ({
    Date: new Date(item.Date).toLocaleDateString(),
    Positive: item.PositiveScore,
    Negative: item.NegativeScore,
  }));

  const allSentimentSeriesRechart = entities.slice(0, 2).map((item) => ({
    EntityName: item.EntityName,
    Positive: item.PositiveScore,
    Negative: item.NegativeScore,
  }));

  const positivesRechart = positiveSentiment?.slice(0, 2).map((item) => ({
    EntityName: item.EntityName,
    Positive: item.OccurenceRatio,
  }));

  const negativeRechart = negativeSentiment?.slice(0, 2).map((item) => ({
    EntityName: item.EntityName,
    Negative: item.OccurenceRatio,
  }));

  return (
    <section className="flex flex-col space-y-12 p-2 relative">
      <Chat
        endpoint="copilot"
        financial={financials}
        sentimentSeries={sentimentSeriesRecharts}
        positiveSentiment={positivesRechart}
        negativeSentiment={negativeRechart}
        news={newsData?.Results}
        company={company}
        relation={relation}
        entities={allSentimentSeriesRechart}
      />
    </section>
  );
}