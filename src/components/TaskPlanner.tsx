import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CheckCircle2, Circle, Zap, Focus, Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Task {
  id: string
  text: string
  type: 'light' | 'deep' | 'admin'
  completed: boolean
  createdAt: Date
}

const TaskPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [selectedType, setSelectedType] = useState<'light' | 'deep' | 'admin'>('light')
  const [isAddingTask, setIsAddingTask] = useState(false)

  const taskTypes = {
    light: { 
      icon: Zap, 
      label: 'Light', 
      color: 'bg-green-500/10 text-green-500 border-green-500/20',
      description: 'Quick wins, easy tasks'
    },
    deep: { 
      icon: Focus, 
      label: 'Deep', 
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      description: 'Focused work, creative tasks'
    },
    admin: { 
      icon: Settings, 
      label: 'Admin', 
      color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      description: 'Maintenance, organizing'
    }
  }

  const addTask = () => {
    if (!newTaskText.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      type: selectedType,
      completed: false,
      createdAt: new Date()
    }

    setTasks(prev => [...prev, newTask])
    setNewTaskText('')
    setIsAddingTask(false)
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask()
    } else if (e.key === 'Escape') {
      setIsAddingTask(false)
      setNewTaskText('')
    }
  }

  const completedCount = tasks.filter(task => task.completed).length
  const totalCount = tasks.length

  return (
    <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Today's Focus</span>
          {totalCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {completedCount}/{totalCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Add Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(taskTypes).map(([type, config]) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedType(type as 'light' | 'deep' | 'admin')
                setIsAddingTask(true)
              }}
              className={`flex items-center gap-2 h-auto py-3 ${
                selectedType === type ? config.color : ''
              }`}
            >
              <config.icon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs font-medium">{config.label}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Add Task Input */}
        <AnimatePresence>
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <Input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={`Add a ${selectedType} task...`}
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={addTask} size="icon" disabled={!newTaskText.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {taskTypes[selectedType].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {tasks.map((task) => {
              const TaskIcon = taskTypes[task.type].icon
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    task.completed 
                      ? 'bg-muted/50 border-muted' 
                      : 'bg-background border-border hover:border-border/60'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTask(task.id)}
                    className="h-6 w-6 p-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    )}
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      task.completed 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}>
                      {task.text}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${taskTypes[task.type].color}`}>
                      <TaskIcon className="w-3 h-3" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="h-6 w-6 p-0 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {tasks.length === 0 && !isAddingTask && (
          <div className="text-center py-8 text-muted-foreground">
            <Focus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Start by adding your first task</p>
            <p className="text-xs mt-1">Choose light, deep, or admin work</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TaskPlanner