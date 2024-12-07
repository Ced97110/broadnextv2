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
import { FormatMarketCap, renderPriceIndicator } from '../cardTrending'
import { Card } from '@/components/ui/card'




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
      <section>
        
           <div className='mt-24'>
              <h2 className="text-2xl font-semibold pb-12">Companies</h2>
            </div>
            <Card className="shadow-2xl rounded-xl overflow-hidden w-full">
                  
              <Table className="shadow-xl rounded-xl overflow-hidden">
                <TableHeader className="bg-gray-200">
                  <TableRow className="bg-gray-200 rounded-t-xl">
                    <TableHead></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Company Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>24h Movement</TableHead>
                    <TableHead>Market Cap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {company?.map(({ 
                    Id, 
                    Name, 
                    LogoUrl,
                    SectorName,
                    Ticker,
                    Location,
                    CompanyType,
                    Price,
                    PriceMovement,
                    PriceChange,
                    MarketCap 
                  },i) => (
                    <TableRow key={Id}>
                      {/* Logo */}
                      <TableCell className="font-medium flex justify-around items-center">
                        <p>{i+1}</p>
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

                      {/* Name */}
                      <TableCell>
                        <Link href={`company/${Id}/summary`}>
                          {Name ?? 'N/A'}
                        </Link>
                      </TableCell>

                      {/* Ticker */}
                      <TableCell>
                        <span className="text-xs text-gray-600">{Ticker ?? 'N/A'}</span>
                      </TableCell>

                      {/* Sector */}
                      <TableCell>{SectorName ?? 'N/A'}</TableCell>

                      {/* Location */}
                      <TableCell>{Location.charAt(0).toUpperCase() + Location.slice(1).toLowerCase() ?? 'N/A'}</TableCell>

                      {/* Company Type */}
                      <TableCell>{CompanyType ?? 'N/A'}</TableCell>

                      {/* Price */}
                      <TableCell>
                        {Price != null ? `$${Price.toFixed(2)}` : 'N/A'}
                      </TableCell>

                      {/* 24h Movement */}
                      <TableCell className="text-center">
                        {PriceMovement != null && PriceChange != null 
                          ? renderPriceIndicator(PriceMovement, PriceChange) 
                          : 'N/A'}
                      </TableCell>

                      {/* Market Cap */}
                      <TableCell>
                        {MarketCap ? FormatMarketCap(MarketCap) : 'N/A'}
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
      
       
  </section>
    )
  }