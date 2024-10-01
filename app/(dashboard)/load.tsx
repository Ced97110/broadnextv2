import { Loader } from 'lucide-react'
import React from 'react'
export default function Loading() {
  return (
    <div className='flex items-center justify-center h-1/2'>
      <Loader className="animate-spin text-muted-foreground h-10 w-10" />
    </div>
  )
}
