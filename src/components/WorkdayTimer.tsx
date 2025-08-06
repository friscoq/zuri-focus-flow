import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast, toast } from '@/hooks/use-toast'
import { Pause, Play, Settings2, Timer as TimerIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TimerSettings {
  workMinutes: number
  breakMinutes: number
  nudges: boolean
  workdayStart: string
  workdayEnd: string
  nudgeInterval: 5 | 10 | 15 | 20
}

const DEFAULT_SETTINGS: TimerSettings = {
  workMinutes: 25,
  breakMinutes: 5,
  nudges: true,
  workdayStart: '09:00',
  workdayEnd: '17:00',
  nudgeInterval: 15,
}

const STORAGE_KEY = 'zuri.workday-timer'

const WorkdayTimer: React.FC = () => {
  const { dismiss } = useToast()
  const [settings, setSettings] = useState<TimerSettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  const [mode, setMode] = useState<'work' | 'break'>('work')
  const [isRunning, setIsRunning] = useState(true)
  const totalSeconds = useMemo(() => (mode === 'work' ? settings.workMinutes : settings.breakMinutes) * 60, [mode, settings])
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [nudgeCounter, setNudgeCounter] = useState(0)

  useEffect(() => {
    setSecondsLeft(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

useEffect(() => {
  if (!isRunning) return
  const interval = setInterval(() => {
    setSecondsLeft((s) => {
      if (s > 1) return s - 1
      // Transition
      const nextMode = mode === 'work' ? 'break' : 'work'
      setMode(nextMode)
      setNudgeCounter(0)
      if (settings.nudges) {
        toast({
          title: nextMode === 'break' ? 'Time for a short break' : 'Back to focus',
          description: nextMode === 'break' ? 'Stand up, breathe, get water.' : 'Pick one task and go deep.'
        })
      }
      return (nextMode === 'work' ? settings.workMinutes : settings.breakMinutes) * 60
    })

    // Periodic nudges during work mode
    setNudgeCounter((c) => {
      const next = c + 1
      if (mode === 'work' && settings.nudges && isWithinWorkday() && next >= settings.nudgeInterval * 60) {
        toast({
          title: 'Time check-in',
          description: 'Take a breath and refocus your next step.',
        })
        return 0
      }
      return next
    })
  }, 1000)
  return () => clearInterval(interval)
}, [isRunning, mode, settings])

  const progress = useMemo(() => {
    const done = totalSeconds - secondsLeft
    return Math.max(0, Math.min(100, (done / totalSeconds) * 100))
  }, [secondsLeft, totalSeconds])

  const toggleRun = () => setIsRunning((r) => !r)
  const reset = () => setSecondsLeft(totalSeconds)

const minutes = Math.floor(secondsLeft / 60)
const secs = secondsLeft % 60
const timeLabel = `${minutes}:${secs.toString().padStart(2, '0')}`

const isWithinWorkday = () => {
  const [sH, sM] = settings.workdayStart.split(':').map(Number)
  const [eH, eM] = settings.workdayEnd.split(':').map(Number)
  const now = new Date()
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const start = sH * 60 + sM
  const end = eH * 60 + eM
  return end >= start
    ? minutesNow >= start && minutesNow <= end
    : minutesNow >= start || minutesNow <= end
}

return (
    <div className="relative">
      {/* Subtle progress bar */}
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-[width] duration-500"
          style={{ width: `${progress}%` }}
          aria-label={`Workday timer progress ${Math.round(progress)}%`}
        />
      </div>

      {/* Discreet controls */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <TimerIcon className="h-3.5 w-3.5" />
          <span className="capitalize">{mode}</span>
          <span aria-live="polite">{timeLabel}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={toggleRun} aria-label={isRunning ? 'Pause timer' : 'Start timer'}>
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2" aria-label="Timer settings">
                <Settings2 className="h-3.5 w-3.5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Focus timer</DrawerTitle>
              </DrawerHeader>
<div className="p-4 space-y-4">
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="work-min">Work (min)</Label>
      <Input
        id="work-min"
        type="number"
        min={1}
        value={settings.workMinutes}
        onChange={(e) => setSettings((s) => ({ ...s, workMinutes: Math.max(1, Number(e.target.value || 0)) }))}
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="break-min">Break (min)</Label>
      <Input
        id="break-min"
        type="number"
        min={1}
        value={settings.breakMinutes}
        onChange={(e) => setSettings((s) => ({ ...s, breakMinutes: Math.max(1, Number(e.target.value || 0)) }))}
        className="mt-1"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="workday-start">Workday start</Label>
      <Input
        id="workday-start"
        type="time"
        value={settings.workdayStart}
        onChange={(e) => setSettings((s) => ({ ...s, workdayStart: e.target.value }))}
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="workday-end">Workday end</Label>
      <Input
        id="workday-end"
        type="time"
        value={settings.workdayEnd}
        onChange={(e) => setSettings((s) => ({ ...s, workdayEnd: e.target.value }))}
        className="mt-1"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 items-center">
    <div>
      <Label htmlFor="nudge-interval">Nudge interval</Label>
      <Select
        value={String(settings.nudgeInterval)}
        onValueChange={(val) => setSettings((s) => ({ ...s, nudgeInterval: Number(val) as 5 | 10 | 15 | 20 }))}
      >
        <SelectTrigger id="nudge-interval" className="h-8 mt-1">
          <SelectValue placeholder="Select interval" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">Every 5 minutes</SelectItem>
          <SelectItem value="10">Every 10 minutes</SelectItem>
          <SelectItem value="15">Every 15 minutes</SelectItem>
          <SelectItem value="20">Every 20 minutes</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="nudges">Nudge notifications</Label>
      <Switch
        id="nudges"
        checked={settings.nudges}
        onCheckedChange={(val) => setSettings((s) => ({ ...s, nudges: val }))}
      />
    </div>
  </div>
</div>
              <DrawerFooter>
                <div className="flex items-center gap-2">
                  <Button onClick={toggleRun} variant="secondary">{isRunning ? 'Pause' : 'Start'}</Button>
                  <Button onClick={reset} variant="outline">Reset</Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  )
}

export default WorkdayTimer
