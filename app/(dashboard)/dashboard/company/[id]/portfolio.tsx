'use client'

import { Button } from "@/components/ui/button"
import { handleInterested } from "@/lib/data";
import { getAccessToken } from "@auth0/nextjs-auth0/edge";
import { Plus } from "lucide-react"

export default function Portfolio({Id}: {Id: number}) {

  

  return (
    <Button className="rounded-full" variant="outline">
      <Plus className="mr-2 h-4 w-4" />
      Add to my portfolio
      {Id}
    </Button>
  )
}