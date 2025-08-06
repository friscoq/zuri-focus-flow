import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Message {
  id: string
  text: string
  sender: 'user' | 'zuri'
  timestamp: Date
}

const AskZuriChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Zuri, your personal productivity companion. How can I help you today?",
      sender: 'zuri',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateZuriResponse = (userMessage: string): string => {
    const responses = {
      stuck: [
        "When you're feeling stuck, try the 2-minute rule: pick the smallest possible step forward.",
        "Sometimes we get stuck because we're thinking too big. What's one tiny action you could take right now?",
        "Being stuck is normal! Try changing your environment or taking a short walk to reset your mind."
      ],
      overwhelmed: [
        "Overwhelm often means we're trying to hold too much at once. Let's break things down into smaller pieces.",
        "Try a brain dump: write everything down, then pick just one thing to focus on for the next 25 minutes.",
        "Remember: you don't have to do everything today. What's the one most important thing?"
      ],
      motivation: [
        "Low motivation? That's your brain asking for a dopamine hit. Start with something easy and build momentum.",
        "Motivation follows action, not the other way around. What's the smallest step you could take?",
        "Try the 10-minute rule: commit to working for just 10 minutes. Often you'll keep going."
      ],
      default: [
        "I understand. Sometimes the best approach is to start small and build from there.",
        "What if we focused on just one thing at a time? What feels most important right now?",
        "Remember, progress over perfection. What's one small step you could take today?"
      ]
    }

    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('stuck') || lowerMessage.includes('block')) {
      return responses.stuck[Math.floor(Math.random() * responses.stuck.length)]
    }
    if (lowerMessage.includes('overwhelm') || lowerMessage.includes('too much') || lowerMessage.includes('stressed')) {
      return responses.overwhelmed[Math.floor(Math.random() * responses.overwhelmed.length)]
    }
    if (lowerMessage.includes('motivat') || lowerMessage.includes('energy') || lowerMessage.includes('lazy')) {
      return responses.motivation[Math.floor(Math.random() * responses.motivation.length)]
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)]
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const zuriResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateZuriResponse(inputText),
        sender: 'zuri',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, zuriResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
              size="icon"
              aria-label="Open Ask Zuri chat"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 h-96 z-50"
          >
            <Card className="h-full bg-card/95 backdrop-blur-sm border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Ask Zuri
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)} aria-label="Close chat">
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
              <CardContent className="flex flex-col h-full p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted text-foreground p-3 rounded-lg text-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      size="icon"
                      className="shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AskZuriChat