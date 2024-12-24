'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { RetractableChat } from '../financial/retractchat';
import Sentiment from './twitter-series';





const Entities = dynamic(() => import('./twitter-entities'));
const PosNeg = dynamic(() => import('./twitter-posneg'));



const TwitterPage = ({Id}) => {

  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible((prev) => !prev);
  };
  
  return (
    <>
 
    
       
     {/* When chat is not visible, show the button full width at the right side */}
     {!isChatVisible && (
       <div className="p-4">
         <Button
           onClick={toggleChat}
           className="mt-4 px-4 my-2 bg-blue-900 text-white rounded-full hover:bg-blue-700 transition-colors w-full"
         >
           Co-Pilot
           <Sparkles className="w-4 h-4 ml-2" />
         </Button>
       </div>
     )}

       {isChatVisible && (
       <div className={`flex-grow h-screen flex gap-4   transition-all duration-300 ${isChatVisible ? 'w-2/4' : 'hidden'}`}>
         <RetractableChat endpoint="twitter" companyId={Id} isChatVisible={isChatVisible} toggleChat={toggleChat} />
       </div>
     )}
 

   
      </>
  )};


export default TwitterPage;