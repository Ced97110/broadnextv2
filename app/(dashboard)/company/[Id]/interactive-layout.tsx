'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Watchlist from './compo/watchlist'
import { useUser } from '@auth0/nextjs-auth0/client'
import { debounce } from 'lodash';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CompanyRelation } from '@/app/types/types';
import { CompanyFetch } from '@/lib/data';
import { AddPortfolio, handleRemove, handleWatchListFetch, RemovePortfolio } from '@/lib/handlers';
import Portfolio from '../../companies/portfolio';




export const InteractiveLayoutBadges = ({Id,isWatched, InPortfolio}) => {

    const { user, isLoading } = useUser();
    const [companyRelation, setCompanyRelation] = useState<CompanyRelation | null>(null);
    const [loadingWatchlist, setLoadingWatchlist] = useState(false);
    const [loadingPortfolio, setLoadingPortfolio] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isWatchedData, setIsWatched] = useState<boolean | null>(isWatched)
    const [inPortfolio, setInPortfolio] = useState<boolean | null>(InPortfolio)

    const notifyAdd = () => toast("Adding to watchlist",{
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
      
      
      });
    const notifyRemove = () => toast("Removing from watchlist",{
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
      });


    const fetchData = useCallback(async () => {
        try {
          const data = await CompanyFetch(Id);
          setCompanyRelation(data);
          setIsWatched(data.IsWatched)
          setInPortfolio(data.InPortfolio)
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
        setLoadingWatchlist(true)
        setLoadingCompanies((prev) => [...prev, Id]);
        notifyAdd()
      
        try {
          await handleWatchListFetch(Id);
          debouncedFetchData();

        } catch (err) {
          setError('Échec de l\'ajout à la watchlist.');
          console.error(err);
        } finally {
          setLoadingCompanies((prev) => prev.filter((id) => id !== Id));
          setLoadingWatchlist(false)
         
        }
      }, [fetchData, debouncedFetchData]);
    
    
        const handleRemoveFromWatchlist = useCallback(async (Id: number) => {
          setLoadingWatchlist(true)
          setLoadingCompanies((prev) => [...prev, Id]);
          notifyRemove()
        
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
            setLoadingWatchlist(false)
          }
        }, [fetchData]);
        
      
    
        const handleAddPortfolio = useCallback(async (Id: number) => {
          setLoadingPortfolio(true)
          setLoadingCompanies((prev) => [...prev, Id]);
          
        
          try {
            await AddPortfolio(Id);
            debouncedFetchData();
          } catch (err) {
            setError('Échec de l\'ajout à la watchlist.');
            console.error(err);
          } finally {
            setLoadingCompanies((prev) => prev.filter((id) => id !== Id));
            setLoadingPortfolio(false)
          }
        }, [fetchData, debouncedFetchData]);



        const handleRemovePortfolio = useCallback(async (Id: number) => {
          setLoadingPortfolio(true)
          setLoadingCompanies((prev) => [...prev, Id]);
        
          try {
            const status = await RemovePortfolio(Id);
            if (status === 200) {
              debouncedFetchData();
            }
          } catch (err) {
            setError('Échec de la suppression de la watchlist.');
            console.error(err);
          } finally {
            setLoadingCompanies((prev) => prev.filter((id) => id !== Id));
            setLoadingPortfolio(false)
          }
        }, [fetchData]);
        
    


  return (
    
    <>
        <div className="flex gap-4">
            <Portfolio Id={companyRelation?.Id} InPortfolio={inPortfolio} loading={loadingPortfolio} handleRemovePortfolio={handleRemovePortfolio}  handleAddPortfolio={handleAddPortfolio} /> 
            <Watchlist Id={companyRelation?.Id} isWatched={isWatchedData} loading={loadingWatchlist} handleRemove={handleRemoveFromWatchlist} handleAddWatchlist={handleAddWatchlist} />
  
        </div>
    </>

  )
}



