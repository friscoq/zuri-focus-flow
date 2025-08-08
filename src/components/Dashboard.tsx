import React, { useEffect, useRef, useState } from 'react'
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

import { Lightbulb, Zap } from 'lucide-react'
import FocusZoneCard from '@/components/FocusZoneCard'
import { SmartNudgeCenter } from '@/components/SmartNudge'
import QuickCapture from '@/components/QuickCapture'
import useShortcuts from '@/hooks/use-shortcuts'
import AccessibilityToggle from '@/components/AccessibilityToggle'
import { useNudges } from '@/contexts/NudgeContext'
import { celebrate } from '@/lib/confetti'
import { useFocus } from '@/contexts/FocusContext'

const Dashboard = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [focusIntent, setFocusIntent] = useState('')
  const [tasksForTimer, setTasksForTimer] = useState<{ text: string; completed: boolean }[]>([])
  const prevCompleted = useRef(0)
  const { enqueue } = useNudges()
  const focus = useFocus()
  useShortcuts()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Celebrate and nudge on task completion increments
  useEffect(() => {
    const completed = tasksForTimer.filter(t => t.completed).length
    if (completed > prevCompleted.current) {
      celebrate()
      enqueue({ nudgeType: 'celebration', nudgeText: 'Task completed — nice win!' })
    }
    prevCompleted.current = completed
  }, [tasksForTimer, enqueue])

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
      <div className="relative z-10 min-h-screen p-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-8">
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
              <TaskPlanner onTasksChange={(tasks: any[]) => setTasksForTimer(tasks.map((t: any) => ({ text: t.text, completed: t.completed })))} />
            </div>
            
            {/* Main Focus Area */}
            <div className="lg:col-span-2">
              <FocusZoneCard />
            </div>
          </motion.div>

          <WorkdayTimer focusLabel={focusIntent} tasks={tasksForTimer} />
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
      {/* Quick Capture portal */}
      <QuickCapture />
    </div>
  )
}

export default Dashboard
