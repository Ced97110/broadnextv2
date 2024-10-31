'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'
import { CheckCircle, CircleMinus, CirclePlus } from 'lucide-react'
import { Spinner } from '@/components/icons'
import { CompanyUser, handleInterested, handleRemove, handleWatchList } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { getPriceIndicator } from '../cardTrending'





  export function TableCompanies({data, token}) {



  const [trendingList, setTrendingList] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [interestedList, setInterestedList] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [company, setSelectedCompany] = useState(data);
  



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
      <section className=''>
        <div>
          <h2 className="text-2xl font-semibold pb-12">Companies</h2>
        </div>
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Add To Watchlist</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {company?.map(({ Id, Name, LogoUrl,SectorName,Ticker }) => (
                <TableRow key={Id}>
                  <TableCell className="font-medium">
                    <Link href={`company/${Id}/summary`}>
                      <Image
                        src={LogoUrl}
                        alt={Name}
                        width={60}
                        height={60}
                        className="object-contain aspect-square"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`company/${Id}/summary`}>
                      {Name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {SectorName}
                  </TableCell>
                  <TableCell>
                  <span className="text-xs text-gray-600">{Ticker ?? 'N/A'}</span>
                </TableCell>
                <TableCell className="text-right">
                  
                </TableCell>
                  <TableCell className="text-right"></TableCell>
                  <TableCell>
                    {watchlist.some(item => item.Id === Id) ? (
                      <Button className="cursor-pointer" onClick={() => handleRemoveFromWatchlist(Id)}>
                         {loadingCompanies.includes(Id) ?  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : <CircleMinus/> }
                      </Button>
                    ) : loadingCompanies.includes(Id) ? (
                      <Spinner />
                    ) : (
                      <Button onClick={() => handlewatchlist(Id)} className="cursor-pointer">
                       {loadingCompanies.includes(Id) ?  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : <CirclePlus/> }
                    </Button>
                    )}
              </TableCell>
                </TableRow>
              ))}
            </TableBody>
         </Table>
      </section>
    )
  }