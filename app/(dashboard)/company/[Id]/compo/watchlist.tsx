'use client'

import { Button } from '@/components/ui/button'
import { FaStar } from "react-icons/fa"
import React, { FC, useCallback, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'


interface Watchlist {
  Id:number
  isWatched: boolean
  isLoading?: boolean
  loading: boolean
  handleRemove: (id:number) => void
  handleAddWatchlist: (id:number) => void
}

export default function Watchlist({Id, isWatched, loading, handleRemove, handleAddWatchlist}: Watchlist) {
    

  const handleClick = async () => {
    if (isWatched) {
      await handleRemove(Id);
    } else {
      await handleAddWatchlist(Id);
    }
  };

  return (
    <div className="relative">
      {loading ? (
        <Button
          className="rounded-full cursor-pointer transition-colors duration-300 flex items-center justify-center"
          disabled
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={handleClick}
          className="rounded-full cursor-pointer transition-colors duration-300 flex items-center justify-center"
        >
          <FaStar
            className={`w-4 h-4 ${
              isWatched ? 'text-yellow-500' : 'text-gray-400'
            }`}
            aria-label={
              isWatched ? 'Retirer de la watchlist' : 'Ajouter à la watchlist'
            }
          />
        </Button>
      )}
    </div>
  );
};
  
