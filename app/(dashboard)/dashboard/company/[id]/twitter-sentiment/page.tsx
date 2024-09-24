import React from 'react'
import TwitterSentiment from './graph';
import { cookies } from 'next/headers';
import { prepareData, prepareDataSentiment } from '@/lib/data';
import { getAccessToken } from '@auth0/nextjs-auth0/edge';


export default async function TwitterPage({ params }: { params: { id: string } }) {
  try {

    console.log('paramsPaArams', params.id);

    const { accessToken } = await getAccessToken();

    const results = await Promise.allSettled([
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        endpoint: 'SentimenAnalysis/PeriodOptions',
        SignalSource: '1',
        
      }, accessToken),
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        endpoint: 'Entities',
        SignalSource: '1',
        
      }, accessToken),
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        FilterSentiment: '1',
        endpoint: 'Entities',
        SignalSource: '1',
       
      }, accessToken),
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        FilterSentiment: '2',
        endpoint: 'Entities',
        SignalSource: '1',
        
      }, accessToken),
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        FilterSentiment: '3',
        endpoint: 'Entities',
        SignalSource: '1',
       
      }, accessToken),
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        endpoint: 'SentimenSeries',
        SignalSource: '1',
       
      }, accessToken),
      prepareData(
        `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`,
        accessToken
       
      ),
    ]);

    // Handle the results of Promise.allSettled
    const [
      periodOptionResult,
      EntitiesResult,
      positiveEntitiesResult,
      negativeEntitiesResult,
      neutralEntitiesResult,
      sentimentDataResult,
      companyResult
    ] = results;

    // Extract values or set defaults in case of errors
    const periodOption = periodOptionResult.status === 'fulfilled' ? periodOptionResult.value : null;
    const Entities = EntitiesResult.status === 'fulfilled' ? EntitiesResult.value : null;
    const positiveEntities = positiveEntitiesResult.status === 'fulfilled' ? positiveEntitiesResult.value : null;
    const negativeEntities = negativeEntitiesResult.status === 'fulfilled' ? negativeEntitiesResult.value : null;
    const neutralEntities = neutralEntitiesResult.status === 'fulfilled' ? neutralEntitiesResult.value : null;
    const sentimentData = sentimentDataResult.status === 'fulfilled' ? sentimentDataResult.value : null;
    const company = companyResult.status === 'fulfilled' ? companyResult.value : null;

    return (
      <div>
        {company ? (
          <TwitterSentiment
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
        ) : (
          <p>Error fetching company data</p>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <div>
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }
}