import * as React from 'react'
import { PromptForm } from './prompt-form'
import { FooterText } from './footer-text'
import { Button } from '@/components/ui/button';



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
    <form onSubmit={handleChatSubmit} className="flex items-center p-4 bg-gray-50 dark:bg-gray-900">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type your message..."
      className="flex-grow px-4 py-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      disabled={loading}
      aria-label="Chat input"
    />
    <Button
      type="submit"
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={loading}
      aria-label="Send message"
    >
      {loading ? 'Sending...' : 'Send'}
    </Button>
  </form>
  )
}
