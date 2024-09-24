import React from 'react'
import TwitterSentiment from './graph';
import NewsSentiment from './graph';
import { getAccessToken } from '@auth0/nextjs-auth0/edge';
import { cookies } from 'next/headers';
import { prepareData, prepareDataSentiment } from '@/lib/data';

export const runtime = 'edge';

export default async function NewsSentimentPage({ params }: { params: { id: string } }) {

  const { accessToken } = await getAccessToken();


  console.log('paramsPaArams', params.id);

  const results = await Promise.allSettled([
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'SentimenAnalysis/PeriodOptions',
      
    }, accessToken),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'Entities',
      
    }, accessToken),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '1',
      SignalSource: '2',
      endpoint: 'Entities',
      
    }, accessToken),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '2',
      SignalSource: '2',
      endpoint: 'Entities',
      
    }, accessToken),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '3',
      SignalSource: '2',
      endpoint: 'Entities',
     
    }, accessToken),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'SentimenSeries',
     
    }, accessToken),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`,
      accessToken
     
    ),
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
        token={accessToken}
      />
    </div>
  );
}