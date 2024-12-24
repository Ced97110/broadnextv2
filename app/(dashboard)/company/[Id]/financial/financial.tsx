'use client';

import React, { useState } from 'react';
import CompanyFinancials from './chart';
import { RetractableChat } from './retractchat';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';




interface FinancialsProps {
  params: string;
  data: any;
}


export default function Financials({data, params}) {
  const summary = 'hello';
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible((prev) => !prev);
  };

  return (
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

      <div className={`flex-col-reverse md:flex-grow flex gap-4 transition-all duration-300`}>
        <div className="w-full">
          <CompanyFinancials
              data={data.data}
              companyprompt={summary}
              companyprompt1={summary}
              companyprompt2={summary}
              companyId={params}
            />
        </div>
        {isChatVisible && (
        <div className={`flex-grow md:flex gap-4 transition-all duration-300 ${isChatVisible ? 'md:w-2/4' : 'w-full'}`}>
          <RetractableChat endpoint="financial" companyId={params} isChatVisible={isChatVisible} toggleChat={toggleChat} />
        </div>
      )}
      </div>
      
    
    </section>
  );
}