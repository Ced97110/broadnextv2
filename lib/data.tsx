'use server'

import { getAccessToken, getSession } from "@auth0/nextjs-auth0/edge";


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
  const { accessToken } = await getAccessToken();

  console.log('TOKEN',accessToken)
  
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
    cache: 'force-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`

    },
  });

  const data = await response.json();

  return data;
}



export async function prepareDataGo(config: Config | undefined,path:string) {

  const { accessToken} = await getAccessToken();
  
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

  const queryString = new URLSearchParams(queryConfig).toString();
  const urlGO = `https://broadwalkgo.onrender.com/api/${path}?${queryString}`;
  const response = await fetch(urlGO, {
    method: 'GET',
    cache: 'force-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`

    },
  });
  const data = await response.json();
  console.log('DATA',data)
  return data;
}


export async function prepareDataSentiment(config: Config | undefined, path: string ) {
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
  const { accessToken } = await getAccessToken();
  const response = await fetch(`https://broadwalkgo.onrender.com/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       'Authorization': `Bearer ${accessToken}`
    },
    cache: 'no-cache',
    body: JSON.stringify(queryConfig),
  });
  return response;
}


export async function CompanyUser() {
  const { accessToken } = await getAccessToken();
  const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/Dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
  });
  const data = await response.json();
  return data;
}




 
export async function ChatHandler(userInput, companyId, endpoint) {
  const { accessToken } = await getAccessToken();
  const response = await fetch(`https://broadwalkgo.onrender.com/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ question: userInput, company_id:companyId }), // Send both user query and financial data
  });
  const data = await response.json();
  return data;
}



export async function CompanyFetch (id: string) {
   const { accessToken } = await getAccessToken();
  const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/CompanyDetails?CompanyId=${id}`, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
  });
  const data = await response.json();
  return data;
}



export async function DataFetch(id: string) {
  const { accessToken } = await getAccessToken();
  const response = await fetch(`https://broadwalkgo.onrender.com/api/financials/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    cache: 'force-cache',
  });
  const rawText = await response.text();
  console.log('Raw Response:', rawText);
  try {
    const data = JSON.parse(rawText);  // Explicitly use JSON.parse to catch any syntax issues
    return data;
  } catch (err) {
    console.error('Failed to parse JSON:', err);
    throw err;  // Re-throw the error to indicate the problem
  }
}



export async function TableList () {
    const {accessToken} = await getAccessToken();
    const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/ListCompanies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    
  });
  const data = await response.json();
  return data;
}



export async function DataFetchNews (id: string) {
   const { accessToken } = await getAccessToken();
  const response = await fetch(`https://broadwalkgo.onrender.com/api/prepare-news/${id}`, {
    method: 'GET',
    cache: 'force-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
  });
  const data = await response.json();
  return data;
}