'use server'

import { getAccessToken, getSession } from "@auth0/nextjs-auth0/edge";
import { revalidatePath } from "next/cache";






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
    cache: 'no-cache',
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
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`

    },
  });

  const data = await response.json();

  console.log('DATA',data)

  return data;
}







  export  async function fetchNews() {

    const { accessToken } = await getAccessToken();
   
      const companyId = 1527;
      try {
        const response = await fetch(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/News?CompanyId=${companyId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${accessToken}`
          },
          cache:"no-cache"
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
    cache: 'force-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
      
    },
   
  });

  const data = await response.json();

  return data;
}



export const handleWatchListFetch = async (companyId) => {
  const { accessToken } = await getAccessToken();
  revalidatePath('/dashboard')
  revalidatePath('/compagnies')

 try {
   const response = await fetch(
     `https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/AddCompanyToWatchlist?CompanyId=${companyId}`,
     {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${accessToken}`
 
       },
      
     },
   );

   // Vérifier le statut de la réponse
   if (response.ok) {
   console.log('Company added to watchlist');
   const Data = await response.json();
   console.log('Data:', Data);

   return Data;
 
   
   } else {
     // Gérer les erreurs de réponse
     const errorData = await response.json();
     console.error('Erreur lors de l\'ajout à la watchlist:', errorData);
   
   }
 } catch (error) {
   // Gérer les erreurs réseau ou autres
   console.error('Erreur lors de la requête:', error);
 
 }
};


export const handleRemove = async (companyId) => {
  const { accessToken } = await getAccessToken();
  revalidatePath('/dashboard')
  revalidatePath('/compagnies')
  try {
    const response = await fetch(
      `https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/RemoveCompany?CompanyId=${companyId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      }
    );
 
    if (response.ok) {
    
    return response.status
  
    
    } else {
      // Gérer les erreurs de réponse
      const errorData = await response.json();
      console.error('Erreur lors de l\'ajout à la watchlist:', errorData);
    
    }
  } catch (error) {
    // Gérer les erreurs réseau ou autres
    console.error('Erreur lors de la requête:', error);
  
  }
 };


export const AddPortfolio = async (companyId) => {
  const { accessToken } = await getAccessToken();
  revalidatePath('/dashboard')
 try {
   const response = await fetch(
     `https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/AddCompanyToPortfolio?CompanyId=${companyId}`,
     {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${accessToken}`
 
       },
      
     },
   );

   // Vérifier le statut de la réponse
   if (response.ok) {
   console.log('Company added to watchlist');
   const Data = await response.json();
   console.log('Data:', Data);

   return Data;
 
   
   } else {
     // Gérer les erreurs de réponse
     const errorData = await response.json();
     console.error('Erreur lors de l\'ajout à la watchlist:', errorData);
   
   }
 } catch (error) {
   // Gérer les erreurs réseau ou autres
   console.error('Erreur lors de la requête:', error);
 
 }
};


export const RemovePortfolio = async (companyId) => {
  const { accessToken } = await getAccessToken();
  revalidatePath('/dashboard')
  try {
    const response = await fetch(
      `https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/RemoveCompanyFromPortfolio?CompanyId=${companyId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      }
    );
 
    if (response.ok) {
    
    return response.status
  
    
    } else {
      // Gérer les erreurs de réponse
      const errorData = await response.json();
      console.error('Erreur lors de l\'ajout à la watchlist:', errorData);
    
    }
  } catch (error) {
    // Gérer les erreurs réseau ou autres
    console.error('Erreur lors de la requête:', error);
  
  }
 };



 
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
    cache: 'force-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    
  });
  const data = await response.json();
  return data;
}