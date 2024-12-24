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
      <Button
        onClick={toggleChat}
        className="mb-4 px-4 py-2 bg-blue-800 text-white hover:bg-blue-700 transition-colors w-full rounded-full"
        aria-expanded={isChatVisible}
        aria-controls="chat-panel"
      >
        {isChatVisible ? 'Hide Co-pilot' : 'Show Co-pilot'}
        <Sparkles className="w-4 h-4" />
      </Button>
      <div id="chat-panel" className="flex-grow">
        <ChatLLM endpoint={endpoint} companyId={companyId} />
      </div>
    </div>
  );
}