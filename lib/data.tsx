'use server'




type PeriodParams = {
  periodType: string;
};

type Config = {
  CompanyId: string ;
  AddNeutralSignal?: string;
  periodParams: PeriodParams;
  PeriodStartDate?: string;
  PeriodEndDate?: string;
  SignalSource?: string ;
  FilterSentiment?: string;
  endpoint?: string;
  token?: string;
}



export async function prepareDataSentiment (config: Config) {
  const {
    CompanyId,
    AddNeutralSignal,
    periodParams,
    PeriodStartDate,
    PeriodEndDate,
    SignalSource,
    FilterSentiment,
    endpoint,
    token
  } = config;

  const queryConfig = {
    CompanyId: CompanyId.toString(),
    AddNeutralSignal: AddNeutralSignal ?? '',
    PeriodType: periodParams.periodType,
    PeriodStartDate: periodParams.periodType === '3' ? PeriodStartDate ?? '' : '',
    PeriodEndDate: periodParams.periodType === '3' ? PeriodEndDate ?? '' : '',
    SignalSource: SignalSource ?? '',
    ...(FilterSentiment && { FilterSentiment })
  };

  const queryString = new URLSearchParams(queryConfig).toString();

  const url = `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/${endpoint}?${queryString}`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'force-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
     

    },
  });

  const data = await response.json();

  return data;
}





export async function prepareData (url:string,token:string){
 
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'force-cache',
    
  });

  const data = await response.json();

  return data;
}



export default async function fetchNews(token:string) {

  const companiesId = [1527, 1534, 1530];
      try {
        const newsPromises = companiesId.map(companyId =>
          fetch(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/News?CompanyId=${companyId}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              
            },
          })
        );
        const news = await Promise.all(newsPromises);
        const newsData = await Promise.all(news.map(response => response.json()));
        return newsData;
     
      
      } catch (error) {
        console.error("Error fetching news:", error);
      }

    } 
