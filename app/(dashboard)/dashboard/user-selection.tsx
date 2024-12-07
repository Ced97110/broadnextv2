'use client'


import { CompanyCard } from './cardTrending';
import { CompanyCardInterested } from './cardInterested';
import { CompanyCardWatchList } from './cardWatchlist';
import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { CompanyUser, handleInterested, handleRemove, handleWatchList } from '@/lib/data';
import { debounce } from 'lodash';



export default function UserSelection({results}) {

  const { Trending, Watched, Interested } = results;

  const [trendingList, setTrendingList] = useState(Trending);
  const [watchlist, setWatchlist] = useState(Watched);
  const [interestedList, setInterestedList] = useState(Interested);
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
      await handleWatchList(Id);
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


  const handleAddInterested = useCallback(async (Id: number) => {
    try {
      const status = await handleInterested(Id);
      if (status === 200) {
        debouncedFetchData();
      }
    } catch (err) {
      setError('Échec de la suppression de la watchlist.');
      console.error(err);
    } finally {
    }
  }, [fetchData]);

   
 
  return (
    <section className='w-full mt-14'>
      <div className='flex flex-col w-full pt-16'>
        <div className='flex flex-col md:flex-row w-full items-center'>
          {/* Company Cards */}
          <div className='w-full md:w-3/6 p-1 rounded-lg'>
            <CompanyCard name='My trending' trending={trendingList} watchlist={watchlist} handleAddInterested={handleAddInterested} loadingCompanies={loadingCompanies} handlewatchlist={handlewatchlist} />
          </div>
          <div className='w-full md:w-3/6 p-1'>
            <CompanyCard name='My watchlist' trending={watchlist} watchlist={watchlist} handleAddInterested={handleAddInterested} loadingCompanies={loadingCompanies} handlewatchlist={handlewatchlist} />
          </div>
        </div>
      </div>
    </section>
  );
}

