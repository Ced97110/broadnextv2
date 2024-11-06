import React from 'react'
import { Chat } from '../financial/chat'
import { prepareData} from '@/lib/data';

export const runtime = 'edge';


export default async function Copilot({ params }: { params: { id: string } }) {
 

  // Use Promise.allSettled to handle errors for each request
  const results = await Promise.allSettled([
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'FinancialCharts',
    },'1'),
    prepareData({
      CompanyId: params.id,
      endpoint: '',
    },'1'),
    prepareData({
      CompanyId: params.id,
      endpoint: 'News',
    },'1'),
    prepareData({
      CompanyId: params.id,
      endpoint: 'Relations',
    },),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'Entities',
      SignalSource: '1',
      
    }, '1'),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '1',
      endpoint: 'Entities',
      SignalSource: '1',
      
    },'1' ),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '2',
      endpoint: 'Entities',
      SignalSource: '1',
      
    },'1' ),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'SentimenSeries',
      SignalSource: '1',
      
    }, '1'),
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
  
  return (
    <section className="flex flex-col space-y-12 p-2 relative">
      <Chat
        endpoint="copilot"
        financial={financials}
        sentimentSeries={sentimentSeries}
        positiveSentiment={positiveSentiment}
        negativeSentiment={negativeSentiment}
        news={newsData?.Results}
        companyId={company}
        relation={relation}
        entities={entities}
      />
    </section>
  );
}