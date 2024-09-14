import * as React from 'react'
import { ButtonScrollToBottom } from './button-scroll'
import { UserMessage } from './user-message'
import { Button } from '@/components/ui/button'
import { ChatShareDialog } from './chat-share-dialog'
import { PromptForm } from './prompt-form'
import { FooterText } from './footer-text'
import { nanoid } from 'nanoid'
import { Plus } from 'lucide-react'


export interface ChatPanelProps {
  id?: string;
  title?: string;
  input?: string;
  setInput?: (value: string) => void;
  handleChatSubmit?: (e: React.FormEvent) => void;
  loading?: boolean;
}

export function ChatPanel({
  input,
  setInput,
  handleChatSubmit,
  loading,
}: ChatPanelProps) {


  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([])

 
  return (
    <div className="w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
     

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
        
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
             
            </div>
          </div>
        ) : null}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} handleChatSubmit={handleChatSubmit} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
