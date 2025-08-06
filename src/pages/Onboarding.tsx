import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    title: 'Task Planner',
    desc: 'Organize your day with a simple, focused planner.'
  },
  {
    title: 'Smart Suggestions',
    desc: 'Zuri surfaces helpful nudges based on your activity.'
  },
  {
    title: 'Ask Zuri',
    desc: 'Chat with Zuri when you need guidance or feel stuck.'
  },
]

const Onboarding = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-3xl">
        <div className="bg-card/90 border border-border rounded-xl p-8">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-bold text-foreground mb-2">
            Welcome to Zuri
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground mb-8">
            Here’s a quick overview to help you get started.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="p-4 rounded-lg border border-border bg-background/50">
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Skip
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Onboarding
