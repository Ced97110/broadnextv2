'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import News from './news-card';
import { RetractableChat } from '../financial/retractchat';



export default function WrapperChatNews({Id,children}) {
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

      <div className={`flex-grow flex gap-4 transition-all duration-300`}>
        <div className="w-full">
          {children}
        </div>
        {isChatVisible && (
        <div className={`flex-grow flex gap-4 transition-all duration-300 ${isChatVisible ? 'w-2/4' : 'hidden'}`}>
          <RetractableChat endpoint="llm-news" companyId={Id} isChatVisible={isChatVisible} toggleChat={toggleChat} />
        </div>
      )}
      </div>
      
    
    </section>
  );
}