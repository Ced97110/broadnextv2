'use client'

import { Button } from '@/components/ui/button'
import { handleRemove, handleWatchList, TableList } from '@/lib/data'
import { FaStar } from "react-icons/fa"
import React, { useCallback, useMemo, useState } from 'react'
import Loading from "@/app/(dashboard)/load";
import StarIconComponent from '../../companies/star'

interface Watchlist {
  Id:number
  isWatched: boolean
  loading: boolean
  handleRemove: (id:number) => void
  handleAddWatchlist: (id:number) => void
}



export default function Watchlist({Id, isWatched,loading, handleRemove, handleAddWatchlist}: Watchlist) {


  return (
    <>
     {loading ? (
            <Loading  />
          ) : isWatched ? (
            <Button variant="outline" className='rounded-full' disabled={loading} onClick={() => isWatched &&  handleRemove(Id)}>
              <StarIconComponent
                isWatched={isWatched}
                onClick={() => handleRemove(Id)}
                className={`w-4 h-4 cursor-pointer transition-colors duration-300 ${
                isWatched ? 'text-yellow-500' : 'text-gray-400'
              }`}
              aria-label={isWatched ? 'Ajouter à la watchlist' : 'Watchlist indisponible'}
            />
            </Button>
          ) : (
            <Button variant="ghost" disabled={loading} onClick={() => !isWatched && handleAddWatchlist(Id)}>
              <StarIconComponent
                isWatched={isWatched}
                onClick={() => handleAddWatchlist(Id)}
                className={`w-4 h-4 cursor-pointer transition-colors duration-300 ${
                isWatched ? 'text-yellow-500' : 'text-gray-400'
              }`}
              aria-label={isWatched ? 'Ajouter à la watchlist' : 'Watchlist indisponible'}
            />
            </Button>
          )}
        </>
      );
    }
  
