import React from 'react'
import TwitterSentiment from './graph';
import { prepareData } from '@/lib/data';

export const runtime = 'edge';



type PeriodParams = {
  periodType: string;
};

type Config = {
  CompanyId?: string ;
  AddNeutralSignal?: string;
  periodParams?: PeriodParams;
  PeriodStartDate?: string;
  PeriodEndDate?: string;
  SignalSource?: string ;
  FilterSentiment?: string;
  endpoint?: string;
  token?: string;
}



export default async function TwitterPage({ params }: { params: { id: string } }) {
  try {

    console.log('paramsPaArams', params.id);

  

    const results = await Promise.allSettled([
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        endpoint: 'SentimenAnalysis/PeriodOptions',
        SignalSource: '1',
        
      }),
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        endpoint: 'Entities',
        SignalSource: '1',
        
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
        
      }),
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        FilterSentiment: '3',
        endpoint: 'Entities',
        SignalSource: '1',
       
      }),
      prepareDataSentiment({
        CompanyId: params.id,
        AddNeutralSignal: 'no',
        periodParams: { periodType: '0' },
        PeriodStartDate: '',
        PeriodEndDate: '',
        endpoint: 'SentimenSeries',
        SignalSource: '1',
       
      }),
      prepareData({
        CompanyId: params.id,   
      }),
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

    console.log('peridoOption', periodOption, Entities);

    return (
      <div>
        helloperio
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


export async function prepareDataSentiment(config: Config | undefined ) {

  const {
    CompanyId = '', // Default to empty string if undefined
    AddNeutralSignal = '',
    periodParams = { periodType: '' }, // Default to an object with empty periodType if undefined
    PeriodStartDate = '',
    PeriodEndDate = '',
    SignalSource = '',
    FilterSentiment = '',
    endpoint = ''
  } = config || {};

  const queryConfig = {
    CompanyId: CompanyId ?? '',
    AddNeutralSignal: AddNeutralSignal ?? '',
    PeriodType: periodParams.periodType,
    PeriodStartDate: periodParams.periodType === '3' ? PeriodStartDate ?? '' : '',
    PeriodEndDate: periodParams.periodType === '3' ? PeriodEndDate ?? '' : '',
    SignalSource: SignalSource ?? '',
    endpoint: endpoint ?? '',
    ...(FilterSentiment && { FilterSentiment })
  };


  const response = await fetch('http://localhost:8080/prepare-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify(queryConfig),
  });

  const data = await response.json();

  return data;
}