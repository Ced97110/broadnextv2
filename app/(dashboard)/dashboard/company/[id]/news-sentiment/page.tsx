import React from 'react'
import TwitterSentiment from './graph';
import NewsSentiment from './graph';
import { prepareData } from '@/lib/data';

export const runtime = 'edge';

export default async function NewsSentimentPage({ params }: { params: { id: string } }) {



  console.log('paramsPaArams', params.id);

  const results = await Promise.allSettled([
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'SentimenAnalysis/PeriodOptions',
      
    },'1'),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'Entities',
      
    },'1' ),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '1',
      SignalSource: '2',
      endpoint: 'Entities',
      
    }, '1'),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '2',
      SignalSource: '2',
      endpoint: 'Entities',
      
    },'1' ),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '3',
      SignalSource: '2',
      endpoint: 'Entities',
     
    }, '1'),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'SentimenSeries',
     
    },'1' ),
    prepareData({
      CompanyId: params.id, 
    },'1' ),
  ]);

  // Destructure the results from the Promise.allSettled array
  const [
    periodOptionResult,
    entitiesResult,
    positiveEntitiesResult,
    negativeEntitiesResult,
    neutralEntitiesResult,
    sentimentDataResult,
    companyResult
  ] = results;

  // Check each result for success or failure and handle accordingly
  const periodOption = periodOptionResult.status === 'fulfilled' ? periodOptionResult.value : null;
  const Entities = entitiesResult.status === 'fulfilled' ? entitiesResult.value : [];
  const positiveEntities = positiveEntitiesResult.status === 'fulfilled' ? positiveEntitiesResult.value : [];
  const negativeEntities = negativeEntitiesResult.status === 'fulfilled' ? negativeEntitiesResult.value : [];
  const neutralEntities = neutralEntitiesResult.status === 'fulfilled' ? neutralEntitiesResult.value : [];
  const sentimentData = sentimentDataResult.status === 'fulfilled' ? sentimentDataResult.value : [];
  const company = companyResult.status === 'fulfilled' ? companyResult.value : null;

  // Log errors for rejected promises
  if (periodOptionResult.status === 'rejected') {
    console.error('Error fetching period options:', periodOptionResult.reason);
  }
  if (entitiesResult.status === 'rejected') {
    console.error('Error fetching entities:', entitiesResult.reason);
  }
  if (positiveEntitiesResult.status === 'rejected') {
    console.error('Error fetching positive entities:', positiveEntitiesResult.reason);
  }
  if (negativeEntitiesResult.status === 'rejected') {
    console.error('Error fetching negative entities:', negativeEntitiesResult.reason);
  }
  if (neutralEntitiesResult.status === 'rejected') {
    console.error('Error fetching neutral entities:', neutralEntitiesResult.reason);
  }
  if (sentimentDataResult.status === 'rejected') {
    console.error('Error fetching sentiment data:', sentimentDataResult.reason);
  }
  if (companyResult.status === 'rejected') {
    console.error('Error fetching company data:', companyResult.reason);
  }

  // Optionally render error messages if any critical data is missing
  if (!company) {
    return (
      <div>
        <p>Error: Unable to fetch company data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <NewsSentiment
        id={params.id}
        period={periodOption}
        dataEntities={Entities}
        positiveEntitiesData={positiveEntities}
        negativeEntitiesData={negativeEntities}
        neutralEntitiesData={neutralEntities}
        sentimentSeriesData={sentimentData}
        company={company}
       
      />
    </div>
  );
}