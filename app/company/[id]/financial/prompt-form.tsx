'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEnterSubmit } from './enter-submit'
export function PromptForm({
  input,
  setInput,
  handleChatSubmit,
}: {
  input: string
  setInput: (value: string) => void
  handleChatSubmit: (e: React.FormEvent) => void;
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [_, setMessages] = React.useState([])

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={handleChatSubmit}
      className="relative flex flex-col max-h-60 w-full bg-background p-4 sm:rounded-md sm:border sm:px-6"
    >
      {/* New chat button */}
      <div className="absolute left-0 top-[14px] sm:left-4">
       
      </div>

      {/* Text input for user message */}
      <textarea
        ref={inputRef}
        placeholder="Send a message..."
        className="min-h-[60px] w-full resize-none bg-transparent p-4 focus:outline-none sm:text-sm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={1}
        spellCheck={false}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
      />

      {/* Send button */}
      <div className="absolute right-0 top-[13px] sm:right-4">
        <Button
          type="submit"
          disabled={input.trim() === ''}
          
        >
          Send
        </Button>
      </div>
    </form>
  )
}
