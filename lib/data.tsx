'use server'

import { getAccessToken } from "@auth0/nextjs-auth0/edge";
import { cookies } from "next/headers";




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



export async function prepareData(config: Config | undefined, urls?:string ) {

  const accessToken = await getAccessToken();
  console.log('accessToken',accessToken.accessToken)

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
    ...(FilterSentiment && { FilterSentiment })
  };

  const queryString = new URLSearchParams(queryConfig).toString();

  const url = urls === '1' ?  `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/${endpoint}?${queryString}` : `https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/${endpoint}?${queryString}`

  console.log('URLLLL,',url)  

  const response = await fetch(url, {
    method: 'GET',
    cache: 'reload',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`,
    },
  });

  const data = await response.json();

  return data;
}


  export  async function fetchNews() {
   
      const companyId = 1527;
      try {
        const response = await fetch(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/News?CompanyId=${companyId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
           
           
          },
        });
    
        // Check if the response is okay and if the content type is JSON
        const contentType = response.headers.get('Content-Type') || '';
        if (response.ok && contentType.includes('application/json')) {
          // Parse and return JSON data
          const data = await response.json();
          return data;
        } else {
          // Handle non-JSON or unexpected responses
          console.error('Expected JSON but received:', contentType);
          const errorText = await response.text(); // Read the full response text for debugging
          console.error('Response body:', errorText);
          return null;
        }
      } catch (error) {
        // Handle network or other fetch-related errors
        console.error('Error fetching news:', error);
        return null;
      }
    }