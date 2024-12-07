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
import { Briefcase, CheckCircle, CircleMinus, CirclePlus, DollarSign, Factory, Globe, Search } from 'lucide-react'
import { Spinner } from '@/components/icons'
import { CompanyUser, handleInterested, handleRemove, handleWatchList } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react';
import PriceIndicator from '../company/price-indicator';
import { FormatMarketCap } from '../cardTrending';
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from '@/components/ui/select'
import { Input } from '@/components/ui/input'




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
      <section className='mt-24'>
      <h2 className="text-2xl font-semibold pb-12">Companies</h2>
      <div className='flex gap-4 my-4 relative'>
        {/* Search Input */}
        <div className='flex-1 relative'>
          <Input type="search" placeholder="Search" />
          <span className='absolute right-3 top-1/2 -translate-y-1/2'>
            <Search className='w-4 h-4 text-gray-500' />
          </span>
        </div>
    
        {/* Sector Select */}
        <div>
          <Select>
            <SelectTrigger className="w-[180px] flex items-center">
              <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">
                <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                Technology
              </SelectItem>
              <SelectItem value="finance">
                <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                Finance
              </SelectItem>
              <SelectItem value="healthcare">
                <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                Healthcare
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
    
        {/* Location Select */}
        <div>
          <Select>
            <SelectTrigger className="w-[180px] flex items-center">
              <Globe className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">
                <Globe className="mr-2 h-4 w-4 text-gray-500" />
                United States
              </SelectItem>
              <SelectItem value="uk">
                <Globe className="mr-2 h-4 w-4 text-gray-500" />
                United Kingdom
              </SelectItem>
              <SelectItem value="de">
                <Globe className="mr-2 h-4 w-4 text-gray-500" />
                Germany
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
    
        {/* Company Type Select */}
        <div>
          <Select>
            <SelectTrigger className="w-[180px] flex items-center">
              <Factory className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Company Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <Factory className="mr-2 h-4 w-4 text-gray-500" />
                Public
              </SelectItem>
              <SelectItem value="private">
                <Factory className="mr-2 h-4 w-4 text-gray-500" />
                Private
              </SelectItem>
              <SelectItem value="startup">
                <Factory className="mr-2 h-4 w-4 text-gray-500" />
                Startup
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
    
        {/* Market Cap Select */}
        <div>
          <Select>
            <SelectTrigger className="w-[180px] flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Market Cap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="large">
                <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                Large Cap
              </SelectItem>
              <SelectItem value="mid">
                <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                Mid Cap
              </SelectItem>
              <SelectItem value="small">
                <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                Small Cap
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    
      {/* Table Section */}
      <Card className="shadow-2xl rounded-xl overflow-hidden w-full">
        <Table className="shadow-xl rounded-xl overflow-hidden p-8">
          <TableHeader className="bg-gray-200">
            <TableRow className="bg-gray-200 rounded-t-xl p-4">
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Company Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Movement</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='p-4'>
            {company?.map(({ 
              Id, 
              Name, 
              LogoUrl,
              Sector,
              Ticker,
              Location,
              Type,
              ClosePrice,
              PriceMovement,
              PriceChange,
              MarketCap 
            },i) => (
              <TableRow key={Id}>
                <TableCell className="font-medium flex justify-around items-center">
                  <p>{i+1}</p>
                  <Link href={`company/${Id}/summary`}>
                    <Image
                      src={LogoUrl}
                      alt={Name}
                      width={50}
                      height={50}
                      className="object-contain aspect-square"
                    />
                  </Link>
                </TableCell>
    
                <TableCell>
                  <Link href={`company/${Id}/summary`}>
                    {Name ?? 'N/A'}
                  </Link>
                </TableCell>
    
                <TableCell>
                  <span className="text-xs text-gray-600">{Ticker ?? 'N/A'}</span>
                </TableCell>
    
                <TableCell>{Sector ? Sector.charAt(0).toUpperCase() + Sector.slice(1).toLowerCase() : 'N/A'}</TableCell>
    
                <TableCell>{Location ? Location.charAt(0).toUpperCase() + Location.slice(1).toLowerCase() : 'N/A'}</TableCell>
    
                <TableCell>{Type ?? 'N/A'}</TableCell>
    
                <TableCell>
                  {ClosePrice != null ? `$${ClosePrice.toFixed(2)}` : 'N/A'}
                </TableCell>
    
                <TableCell className="text-center">
                  {PriceMovement != null && PriceChange != null 
                    ? <PriceIndicator PriceMovement={Number(PriceMovement)} PriceChange={PriceChange}/> 
                    : 'N/A'}
                </TableCell>
    
                <TableCell>
                  {MarketCap ? FormatMarketCap(MarketCap) : 'N/A'}
                </TableCell>
    
                <TableCell>
                  <Button variant="ghost">
                    <Link href={`company/${Id}/summary`}>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </TableCell>
    
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
    )
  }