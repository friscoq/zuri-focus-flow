import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Clock, Zap, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Suggestion {
  id: string
  text: string
  icon: React.ElementType
  type: 'time' | 'behavior' | 'productivity'
}

const SuggestionBar = () => {
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const suggestions: Suggestion[] = [
    {
      id: '1',
      text: "It's been 25 minutes - time for a quick break?",
      icon: Clock,
      type: 'time'
    },
    {
      id: '2',
      text: "Try breaking that big task into smaller chunks",
      icon: Zap,
      type: 'productivity'
    },
    {
      id: '3',
      text: "You've been focused for a while - celebrate this win!",
      icon: Lightbulb,
      type: 'behavior'
    },
    {
      id: '4',
      text: "Quick dopamine hit: check off an easy task first",
      icon: Zap,
      type: 'productivity'
    },
    {
      id: '5',
      text: "Deep work time - consider silencing notifications",
      icon: Lightbulb,
      type: 'behavior'
    }
  ]

  useEffect(() => {
    // Show a suggestion after 3 seconds, then cycle every 30 seconds
    const initialTimer = setTimeout(() => {
      showRandomSuggestion()
    }, 3000)

    const interval = setInterval(() => {
      showRandomSuggestion()
    }, 30000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  const showRandomSuggestion = () => {
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    setCurrentSuggestion(randomSuggestion)
    setIsVisible(true)
  }

  const dismissSuggestion = () => {
    setIsVisible(false)
    setTimeout(() => setCurrentSuggestion(null), 300)
  }

  if (!currentSuggestion) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-4 py-3 shadow-lg max-w-md mx-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-full">
                  <currentSuggestion.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-foreground font-medium">
                  {currentSuggestion.text}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissSuggestion}
                className="h-6 w-6 p-0 hover:bg-muted/50"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SuggestionBar