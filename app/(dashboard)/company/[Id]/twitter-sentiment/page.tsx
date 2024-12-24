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



const TwitterPage = ({params}: {params: {Id: string}}) => {

  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible((prev) => !prev);
  };
  
  return (
    <>
   <section className=" gap-4 h-screen relative">
    
       
     {/* When chat is not visible, show the button full width at the right side */}
     {!isChatVisible && (
       <div className="p-4">
         <Button
           onClick={toggleChat}
           className="mt-4 px-4 my-2 bg-blue-900 text-white rounded-full hover:bg-blue-700 transition-colors w-full"
         >
           Co-pilot
           <Sparkles className="w-4 h-4 ml-2" />
         </Button>
       </div>
     )}

     <div className={`gap-4 transition-all duration-300`}>
       <div className="w-full">
       <div className=" justify-around w-full h-full">
        <div className="w-full py-12 px-12">
         <Sentiment id={params.Id} source={1}/>
      </div>
   </div>
       </div>
       {isChatVisible && (
       <div className={`flex-grow h-screen flex gap-4   transition-all duration-300 ${isChatVisible ? 'w-2/4' : 'hidden'}`}>
         <RetractableChat endpoint="twitter" companyId={params.Id} isChatVisible={isChatVisible} toggleChat={toggleChat} />
       </div>
     )}
     </div>
     
   
   </section>
   
      </>
  )};


export default TwitterPage;