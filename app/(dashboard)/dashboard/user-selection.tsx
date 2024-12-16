'use client'


import { CompanyCard } from './cardTrending';
import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { CompanyUser, handleRemove, handleWatchListFetch } from '@/lib/data';
import { debounce } from 'lodash';
import { BsBuildingsFill } from 'react-icons/bs';
import { IoMdTrendingUp } from 'react-icons/io';
import { FaRegStar } from "react-icons/fa6";



interface UserSelectionProps {
  results: any;
}


export default function UserSelection({results}: UserSelectionProps) {


  const { Trending, Watched, Interested, Portfolio } = results;

  const [trendingList, setTrendingList] = useState(Trending);
  const [watchlist, setWatchlist] = useState(Watched);
  const [interestedList, setInterestedList] = useState(Interested);
  const [portfolioList, setPortfolioList] = useState(Portfolio);
  const [loadingCompanies, setLoadingCompanies] = useState([]);
  const [error, setError] = useState<string | null>(null);
  
  console.log('Trending',Trending)


  // Fonction pour récupérer les données
  const fetchData = useCallback(async () => {
    try {
      const data = await CompanyUser();
      setTrendingList(data.Trending);
      setWatchlist(data.Watched);
      setInterestedList(data.Interested);
      setPortfolioList(data.Portfolio);
    } catch (err) {
      setError('Échec de la récupération des données.');
      console.error(err);
    }
  }, []);

  const debouncedFetchData = useMemo(() => debounce(fetchData, 500), [fetchData]);


  // useEffect pour récupérer les données initiales
  useEffect(() => {
    debouncedFetchData.cancel();
  }, [debouncedFetchData]); 
  
  useEffect(() => {
    debouncedFetchData();
  }, [debouncedFetchData]);
  // Dépend uniquement de fetchData, qui est stable grâce à useCallback

  // Fonction pour ajouter une société à la watchlist
  const handlewatchlist = useCallback(async (Id: number) => {
    setLoadingCompanies((prev) => [...prev, Id]);
    try {
      await handleWatchListFetch(Id);
      debouncedFetchData();
    } catch (err) {
      setError('Échec de l\'ajout à la watchlist.');
      console.error(err);
    } finally {
      setLoadingCompanies((prev) => prev.filter((id) => id !== Id));
    }
  }, [fetchData]);

  // Fonction pour supprimer une société de la watchlist
  const handleRemoveFromWatchlist = useCallback(async (Id: number) => {
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
    }
  }, [fetchData]);


  
  return (
    <section className='w-full mt-14'>
       <div className='flex flex-col w-full pt-16'>
        <div className='flex flex-col md:flex-row w-full items-center flex-wrap'>
          {/* Company Cards */}
          <div className='w-full md:w-3/6 p-1'>
            <CompanyCard name='My Portfolio' trending={portfolioList} watchlist={watchlist}  loadingCompanies={loadingCompanies} handlewatchlist={handlewatchlist} icon={<BsBuildingsFill />} />
          </div>
          <div className='w-full md:w-3/6 p-1'>
            <CompanyCard name='My Watchlist' trending={watchlist} watchlist={watchlist}  loadingCompanies={loadingCompanies} handlewatchlist={handlewatchlist} icon={<FaRegStar />} />
          </div>
          <div className='w-full flex-1 md:w-6/6 p-1 rounded-lg'>
            <CompanyCard name='Trending Companies' trending={trendingList} watchlist={watchlist}  loadingCompanies={loadingCompanies} handlewatchlist={handlewatchlist} icon={<IoMdTrendingUp />} />
          </div>
        </div>
      </div>
    </section>
  );
}

