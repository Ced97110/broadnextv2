"use server"

import { getAccessToken } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";



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
    revalidatePath('/compagnies')
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
    revalidatePath('/compagnies')
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
  
  