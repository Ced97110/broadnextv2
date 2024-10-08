'use client'

import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
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
  endpoint?: string
  positiveSentiment?: any
  negativeSentiment?: any
  sentimentSeries?: any
  newsData?: any
  relation?: any
  entities?: any
  financial?: any
  news?: any
}


export function Chat({className,raw, title, subtitle,endpoint,financial, positiveSentiment, negativeSentiment,sentimentSeries,entities,news}: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const { user, error, isLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState(''); // Stores user chat input


  const sentimentSeriesRecharts = useMemo(() => {
    return sentimentSeries?.map(item => ({
      Date: new Date(item.Date).toLocaleDateString(),
      Positive: item.PositiveScore,
      Negative: item.NegativeScore,
    }));
  }, [sentimentSeries]);

  const allSentimentSeriesRechart = useMemo(() => {
    return entities?.slice(0, 2).map((item) => ({
      EntityName: item.EntityName,
      Positive: item.PositiveScore,
      Negative: item.NegativeScore,
    }));
  }, [entities]);

  const positivesRechart = useMemo(() => {
    return positiveSentiment?.slice(0, 2).map((item) => ({
      EntityName: item.EntityName,
      Positive: item.OccurenceRatio,
    }));
  }, [positiveSentiment]);

  const negativeRechart = useMemo(() => {
    return negativeSentiment?.slice(0, 2).map((item) => ({
      EntityName: item.EntityName,
      Negative: item.OccurenceRatio,
    }));
  }, [negativeSentiment]);


  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return; // Do nothing for empty inputs

    setLoading(true); // Show loading indicator when processing

    try {
      // Add user's question to the messages state
      const userMessage = {
        id: `user-${Date.now()}`, // Unique ID
        role: 'user',
        content: userInput,
        display: (
          <div className="flex justify-start items-start space-x-2">
          <Image
            src={user?.picture ?? '/placeholder-user.jpg'}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
            <div className="p-2 rounded-lg">{userInput}</div>
          </div>
        ), // JSX to display user message with avatar
       
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send user input to OpenAI API
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userInput, raw,financial, positivesRechart, negativeRechart,sentimentSeriesRecharts,allSentimentSeriesRechart ,news }), // Send both user query and financial data
      });

      const data = await response.json();
      console.log('API response1:', data.summary);
      console.log('API response:', data.summary1);
     

      // Extract the summary from the API response
      const assistantMessage = {
        id: `assistant-${Date.now()}`, // Unique ID
        role: 'assistant',
        content: data.summary, // Use the 'summary' field from the response
        display: (
          <div className="flex justify-start items-start space-x-2">
            <Image
              src="/logo.png"
              width={36}
              height={36} // Placeholder image for OpenAI assistant avatar
              alt="Assistant Avatar"
              className="rounded-full"
            />
            <div className="p-2 rounded-lg">{data.summary}</div>
          </div>
        ), 
      
      };

      // Add assistant's response to the messages state
      setMessages((prev) => [...prev, assistantMessage]);

      // Clear the input field after sending
      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loading after response
    }
  };
  
  useEffect(() => {
    const messagesLength = messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [messages, router])


  
  return (
    <div
      className="max-h-50vh group w-full overflow-y-scroll pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
     
    >
      <div
        className={cn('pb-[10px] pt-4 md:pt-10 ', className)}
       
      >
        {messages.length ? (
          <ChatList messages={messages} isShared={false}  />
        ) : (
          <EmptyScreen title={title} subtitle={subtitle} />
        )}
        <div className="w-full h-px"  />
      </div>
      <ChatPanel
        input={userInput}
        setInput={setUserInput}
        handleChatSubmit={handleChatSubmit}
        loading={loading}
      />
    </div>
  )
}
