'use client'

import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EmptyScreen } from './empty-screen'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'


export interface ChatProps extends React.ComponentProps<'div'> {
  messages?: any
  id?: string
  missingKeys?: string[]
  raw?: any
  company?: any
  title?: string
  subtitle?: string
}


export function Box({className,raw, company, title, subtitle}: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const { user, error, isLoading } = useUser();
 

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState(''); // Stores user chat input


  useEffect(() => {
    const messagesLength = messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [messages, router])


  
  return (
    <div
      className="max-h-50vh group w-full overflow-y-scroll pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pb-[10px] pt-4 md:pt-10 ', className)}>
       
        <div className="w-full h-px"  />
      </div>
    </div>
  )
}
