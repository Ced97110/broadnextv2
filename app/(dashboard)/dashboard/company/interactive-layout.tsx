'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CompanyFetch } from '@/lib/data';
import { handleRemove } from '@/lib/data';
import Watchlist from './[id]/watchlist'
import Portfolio from './[id]/portfolio'
import { useUser } from '@auth0/nextjs-auth0/client'
import { debounce } from 'lodash';
import { CompanyRelation } from './[id]/layout'
import { handleWatchList } from '@/lib/data'
import { getAccessToken } from '@auth0/nextjs-auth0/edge';

export const InteractiveLayoutBadges = ({Id}) => {

    const { user, isLoading } = useUser();
    const [companyRelation, setCompanyRelation] = useState<CompanyRelation | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);


    const fetchData = useCallback(async () => {
        try {
          const data = await CompanyFetch(Id);
          setCompanyRelation(data);
          console.log(data)
        } catch (err) {
          setError('Échec de la récupération des données.');
          console.error(err);
        }
      }, []);
    
      const debouncedFetchData = useMemo(() => debounce(fetchData, 500), [fetchData]);
    
      
        
      useEffect(() => {
        debouncedFetchData.cancel();
      }, [debouncedFetchData]); 
    
      useEffect(() => {
        debouncedFetchData();
      }, [debouncedFetchData]);
      // Dépend uniquement de fetchData, qui est stable grâce à useCallback
        
    
        
      const handleAddWatchlist = useCallback(async (Id: number) => {
        setLoading(true)
        setLoadingCompanies((prev) => [...prev, Id]);
      
        try {
          await handleWatchList(Id);
          debouncedFetchData();
        } catch (err) {
          setError('Échec de l\'ajout à la watchlist.');
          console.error(err);
        } finally {
          setLoadingCompanies((prev) => prev.filter((id) => id !== Id));
          setLoading(false)
        }
      }, [fetchData, debouncedFetchData]);
    
    
        const handleRemoveFromWatchlist = useCallback(async (Id: number) => {
          setLoading(true)
          setLoadingCompanies((prev) => [...prev, Id]);
        
          try {
            const status = await handleRemove(Id);
            if (status === 200) {
              debouncedFetchData();
            }
          } catch (err) {
            setError('Échec de la suppression de la watchlist.');
            console.error(err);
          } finally {
            setLoadingCompanies((prev) => prev.filter((id) => id !== Id));
            setLoading(false)
          }
        }, [fetchData]);
        
      
    
        
    


  return (
    
    <>
        <div className="flex gap-4">
            <Portfolio Id={companyRelation?.Id} /> 
            <Watchlist Id={companyRelation?.Id} isWatched={companyRelation?.IsWatched} loading={loading} handleRemove={handleRemoveFromWatchlist} handleAddWatchlist={handleAddWatchlist} />
            
        </div>
    </>

  )
}



