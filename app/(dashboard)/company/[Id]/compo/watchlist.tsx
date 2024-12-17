'use client'

import { Button } from '@/components/ui/button'
import { FaStar } from "react-icons/fa"
import React, { useCallback, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'


interface Watchlist {
  Id:number
  isWatched: boolean
  isLoading?: boolean
  loading: boolean
  handleRemove: (id:number) => void
  handleAddWatchlist: (id:number) => void
}


export default function Watchlist({Id, isWatched,isLoading,loading, handleRemove, handleAddWatchlist}: Watchlist) {

  return (
     <>
    {loading && !isWatched ? <Button className="rounded-full cursor-pointer transition-colors duration-300" disabled>
      <Loader2 className="animate-spin" />
     </Button> :
     isWatched ? (
      <Button variant='outline' onClick={() =>  handleAddWatchlist(Id)}  className={`rounded-full cursor-pointer transition-colors duration-300`}>
          <FaStar className={`star active w-4 h-4 cursor-pointer transition-colors duration-300 text-yellow-500 `}
          aria-label="Retirer de la watchlist" />
       </Button> 
    ) : (
      <Button variant='outline' onClick={() => handleRemove(Id)}  className={`rounded-full cursor-pointer transition-colors duration-300`}>
        <FaStar className="h-4 w-4 star text-gray-400 inactive"  aria-label="ajouter de la watchlist" />
     </Button> 
    )}
    </>
      );
    }
  
