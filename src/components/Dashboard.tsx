import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import SuggestionBar from './SuggestionBar'
import AskZuriChat from './AskZuriChat'
import TaskPlanner from './TaskPlanner'
import WorkdayTimer from './WorkdayTimer'
import FeedbackDialog from './FeedbackDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

const Dashboard = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [focusIntent, setFocusIntent] = useState('')

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* AI-powered suggestion bar */}
      <SuggestionBar />
      
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10 min-h-screen p-6">
<Card id="workday-timer" className="bg-card/90 backdrop-blur-sm border-border">
  <CardHeader className="pb-2">
    <CardTitle className="text-base">Focus Timer</CardTitle>
  </CardHeader>
  <CardContent>
    <WorkdayTimer />
  </CardContent>
</Card>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 pt-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-primary rounded-full animate-pulse" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl font-bold text-foreground mb-4"
            >
              Welcome to Zuri Beta
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-muted-foreground mb-2"
            >
              Hi {user?.email?.split('@')[0]}, let's make today productive
            </motion.p>
          </motion.div>

          {/* Interactive Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
          >
            {/* Task Planner */}
            <div className="lg:col-span-1">
              <TaskPlanner />
            </div>
            
            {/* Main Focus Area */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-8 h-full"
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Your Focus Zone
                </h2>
                <p className="text-muted-foreground mb-6">
                  Define your next focus and start a calm, time-boxed session.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Input
                    value={focusIntent}
                    onChange={(e) => setFocusIntent(e.target.value)}
                    placeholder="What will you focus on next?"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      toast({ title: 'Focus started', description: focusIntent ? `Intent: ${focusIntent}` : 'You got this.' })
                      document.getElementById('workday-timer')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    disabled={!focusIntent.trim()}
                  >
                    Start focus
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('workday-timer')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Timer settings
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">💡 Smart Suggestions</h3>
                    <p className="text-muted-foreground">Get context-aware nudges and productivity tips</p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">🧠 AI Assistant</h3>
                    <p className="text-muted-foreground">Chat with Zuri when you need help or motivation</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <FeedbackDialog />
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ask Zuri Chat Assistant */}
      <AskZuriChat />
    </div>
  )
}

export default Dashboard
