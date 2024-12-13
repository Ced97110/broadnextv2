import { Button } from '@/components/ui/button'
import { handleWatchList } from '@/lib/data'
import { Star } from 'lucide-react'
import React from 'react'

export default function Watchlist({id}: {id: string}) {

  

  return (
    <Button onClick={() => handleWatchList(id)} className="rounded-full" variant="outline">
      <Star className="h-4 w-4" />
    </Button>
  )
}