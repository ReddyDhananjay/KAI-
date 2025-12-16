'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, ShoppingCart, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ProductCard } from '@/components/products/ProductCard'
import { SuggestionChips } from '@/components/chat/SuggestionChips'
import { chatAPI } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  products?: any[]
  suggestions?: string[]
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm KAI, your AI shopping assistant! 🛍️ I can help you find products, compare prices across platforms, and discover the best deals. What are you looking for today?",
      suggestions: [
        "Show me best deals on smartphones",
        "Compare running shoes",
        "Recommend a laptop under ₹50000",
        "What are today's top deals?"
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await chatAPI.sendMessage(messageText, sessionId)
      
      if (!sessionId) {
        setSessionId(response.session_id)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        products: response.products,
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please make sure the backend server is running and try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Chat with KAI</h1>
                <p className="text-sm text-gray-500">Your AI Shopping Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Top Deals
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage message={message} />
                
                {/* Products Grid */}
                {message.products && message.products.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {message.products.map((product, idx) => (
                      <ProductCard key={idx} product={product} />
                    ))}
                  </motion.div>
                )}

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4"
                  >
                    <SuggestionChips
                      suggestions={message.suggestions}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-gray-500"
            >
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              <span className="text-sm ml-2">KAI is thinking...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message... (e.g., 'Show me laptops under 50k')"
              disabled={isLoading}
              className="flex-1 text-base"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="lg"
              className="px-6"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            KAI can help you search, compare, and buy products across multiple platforms
          </p>
        </div>
      </div>
    </div>
  )
}
