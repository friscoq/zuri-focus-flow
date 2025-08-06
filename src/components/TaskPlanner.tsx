import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CheckCircle2, Circle, Zap, Focus, Settings, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'

interface Task {
  id: string
  text: string
  type: 'light' | 'deep' | 'admin'
  priority: 'low' | 'medium' | 'high'
  notes?: string
  completed: boolean
  createdAt: Date
}

const TaskPlanner = ({ onTasksChange }: { onTasksChange?: (tasks: Task[]) => void }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [selectedType, setSelectedType] = useState<'light' | 'deep' | 'admin'>('light')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newTaskNotes, setNewTaskNotes] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  useEffect(() => { onTasksChange?.(tasks) }, [tasks, onTasksChange])

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
    priority: newTaskPriority,
    notes: newTaskNotes?.trim() ? newTaskNotes.trim() : undefined,
    completed: false,
    createdAt: new Date(),
  }

  setTasks(prev => [...prev, newTask])
  setNewTaskText('')
  setNewTaskNotes('')
  setNewTaskPriority('medium')
  setShowDetails(false)
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

  const updatePriority = (taskId: string, priority: 'low' | 'medium' | 'high') => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, priority } : task))
    )
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
<div className="flex items-center justify-between">
  <p className="text-xs text-muted-foreground">
    {taskTypes[selectedType].description}
  </p>
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="h-7 px-2 text-xs"
    onClick={() => setShowDetails((v) => !v)}
    aria-expanded={showDetails}
  >
    {showDetails ? 'Hide details' : 'More details'}
  </Button>
</div>
<AnimatePresence>
  {showDetails && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      <div>
        <Label className="text-xs text-muted-foreground">Priority</Label>
        <Select
          value={newTaskPriority}
          onValueChange={(val) => setNewTaskPriority(val as 'low' | 'medium' | 'high')}
        >
          <SelectTrigger className="h-8 mt-1">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="sm:col-span-2">
        <Label className="text-xs text-muted-foreground">Notes (optional)</Label>
        <Textarea
          value={newTaskNotes}
          onChange={(e) => setNewTaskNotes(e.target.value)}
          placeholder="Add context or steps..."
          className="mt-1"
          rows={3}
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>
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
                  className={`p-3 rounded-lg border transition-all ${
                    task.completed 
                      ? 'bg-muted/50 border-muted' 
                      : 'bg-background border-border hover:border-border/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
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
  size="sm"
  onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
  className="h-7 px-2 text-xs"
  aria-label="Toggle task details"
>
  {expandedTaskId === task.id ? 'Hide details' : 'More details'}
</Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="h-6 w-6 p-0 hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedTaskId === task.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 rounded-md border border-border bg-muted/30 p-3"
                      >
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
  <div>
    <Label className="text-xs text-muted-foreground">Priority</Label>
    <Select
      value={task.priority}
      onValueChange={(val) => updatePriority(task.id, val as 'low' | 'medium' | 'high')}
    >
      <SelectTrigger className="h-8 mt-1">
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="text-xs text-muted-foreground sm:text-right">
    Added {formatDistanceToNow(task.createdAt)} ago
  </div>
  {task.notes && (
    <div className="sm:col-span-2">
      <Label className="text-xs text-muted-foreground">Notes</Label>
      <p className="text-sm mt-1 whitespace-pre-wrap">{task.notes}</p>
    </div>
  )}
</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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