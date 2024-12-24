'use client';



import React from 'react';
import { ChatLLM } from './chat';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface RetractableChatProps {
  companyId: string;
  endpoint: string;
  isChatVisible: boolean;
  toggleChat: () => void;
}

export function RetractableChat({ companyId, endpoint, isChatVisible, toggleChat }: RetractableChatProps) {
  return (
    <div className="flex w-full flex-col h-full overflow-y-scroll">
      <div className='w-1/2'>
       
      </div>
     
      <div id="chat-panel" className="flex-grow">
        <ChatLLM endpoint={endpoint} companyId={companyId} />
      </div>
    </div>
  );
}