'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { RetractableChat } from '../financial/retractchat';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';


export const runtime = 'edge';

const Sentiment = dynamic(() => import('./twitter-series'));
const Entities = dynamic(() => import('./twitter-entities'));
const PosNeg = dynamic(() => import('./twitter-posneg'));

const TwitterPage = ({params}: {params: {id: string}}) => {

  const CompanyId = params.id;
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible((prev) => !prev);
  };
  
  return (
    <>
   <section className="flex flex-col gap-4 h-screen relative">
     
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

     <div className={`flex-grow flex gap-4 transition-all duration-300`}>
       <div className="w-full">
       <div className="flex justify-around w-full h-full">
        <div className="flex w-full py-12 px-12">
        <Tabs defaultValue="Financial Health" orientation="vertical" className="w-full flex flex-row space-x-6">
          <TabsList className="flex flex-col items-start space-y-2 mt-10">
            <TabsTrigger value="Financial Health">Sentiment</TabsTrigger>
            <TabsTrigger value="Challenges">Popular Entities</TabsTrigger>
            <TabsTrigger value="Valuation">Entities</TabsTrigger>
          </TabsList>
    
          <div className="w-full">
            <TabsContent value="Financial Health">
              <Sentiment id={params.id} source='1'/>
            </TabsContent>
            <TabsContent value="Challenges">
               <Entities   id={params.id} source='1'/>
            </TabsContent>
            <TabsContent value="Valuation">
              <PosNeg id={params.id} source='1' />
            </TabsContent>
          </div>
        </Tabs>
      </div>
   </div>
       </div>
       {isChatVisible && (
       <div className={`flex-grow h-screen flex gap-4   transition-all duration-300 ${isChatVisible ? 'w-2/4' : 'hidden'}`}>
         <RetractableChat endpoint="twitter" companyId={params.id} isChatVisible={isChatVisible} toggleChat={toggleChat} />
       </div>
     )}
     </div>
     
   
   </section>
   
      </>
  )};


export default TwitterPage;