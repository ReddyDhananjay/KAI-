import { motion } from 'framer-motion'
import { User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant'
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex items-start space-x-3',
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-gray-200'
            : 'bg-gradient-to-br from-primary-600 to-purple-600'
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-gray-600" />
        ) : (
          <Sparkles className="h-5 w-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-primary-600 text-white rounded-tr-none'
            : 'bg-white border border-gray-200 rounded-tl-none shadow-sm'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </motion.div>
    </div>
  )
}
