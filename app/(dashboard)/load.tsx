import { Loader, Loader2 } from 'lucide-react'
import React from 'react'
export default function Loading() {
  return (
    <div className='flex items-center justify-center h-1/2'>
      <Loader2 className="animate-spin h-10 w-10" />
    </div>
  )
}
