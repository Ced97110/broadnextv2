'use client'


import { CompanyCardWatchlist } from '@/app/card';
import { getAccessToken } from '@auth0/nextjs-auth0/edge';
import { CompanyCardTrending } from './cardTrending';
import { CompanyCardInterested } from './cardInterested';
import { CompanyCardWatchList } from './cardWatchlist';
import { use, useCallback, useEffect, useState } from 'react';
import { CompanyUser, handleInterested, handleRemove, handleWatchList } from '@/lib/data';
import { Company } from '@/lib/company/companySlice';




export default function UserSelection({results}) {

  const { Trending, Watched, Interested } = results;

  const [trendingList, setTrendingList] = useState<Company[]>(Trending);
  const [watchlist, setWatchlist] = useState<Company[]>(Watched);
  const [interestedList, setInterestedList] = useState<Company[]>(Interested);
  const [loadingCompanies, setLoadingCompanies] = useState<number[]>([]);
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

  // useEffect pour récupérer les données initiales
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dépend uniquement de fetchData, qui est stable grâce à useCallback

  // Fonction pour ajouter une société à la watchlist
  const handlewatchlist = useCallback(async (Id: number) => {
    setLoadingCompanies((prev) => [...prev, Id]);
    try {
      await handleWatchList(Id);
      await fetchData(); // Re-fetch les données après ajout
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
        await fetchData(); // Re-fetch les données après suppression
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
        await fetchData(); // Re-fetch les données après suppression
      }
    } catch (err) {
      setError('Échec de la suppression de la watchlist.');
      console.error(err);
    } finally {
    }
  }, [fetchData]);

   
 
  return (
    <section>
      <div className='flex flex-col items-center pt-16'>
        <div className='flex flex-col md:flex-row w-full justify-evenly items-center'>
          {/* Company Cards */}
          <div className='w-full md:w-2/6 p-1 rounded-lg'>
            <CompanyCardTrending trending={trendingList} watchlist={watchlist} handleAddInterested={handleAddInterested} loadingCompanies={loadingCompanies} handlewatchlist={handlewatchlist} />
          </div>
          <div className='w-full md:w-2/6 p-1'>
            <CompanyCardWatchList watchlist={watchlist} handleRemoveFromWatchlist={handleRemoveFromWatchlist} loadingCompanies={loadingCompanies} />
          </div>
          <div className='w-full md:w-2/6 p-1'>
            <CompanyCardInterested  interested={interestedList}/>
          </div>
        </div>
      </div>
    </section>
  );
}

