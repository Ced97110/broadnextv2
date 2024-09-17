import Link from 'next/link'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Separator } from '@/components/ui/separator'


export interface ChatList {
  messages?: any
  session?: any
  isShared: boolean
}

export function ChatList({ messages, session, isShared }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative max-h-50vh mx-auto max-w-2xl px-4">
    {messages.map((message, index) => (
      <div key={message.id}>
        {message.display} {/* Render the JSX stored in the display field */}
        {index < messages.length - 1 && <Separator className="my-4" />}
      </div>
    ))}
  </div>
  )
}
