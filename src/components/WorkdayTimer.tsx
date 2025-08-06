import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { toast } from '@/components/ui/sonner'
import { Pause, Play, Settings2, Timer as TimerIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ensureNotificationPermission, showSystemNotification } from '@/lib/notifications'

// Supabase Storage public URLs for notification sounds
const SUPABASE_PUBLIC_BASE = 'https://bzdfyikvgkolunfmghdk.supabase.co/storage/v1/object/public'
const SOUND_BUCKET = 'notification-sounds'
const SOUND_FILES = {
  ringtone90s: '90s Ringtone.wav',
  subtle: 'Subtle.wav',
  soft: 'Soft.wav',
  dontClickMe: "Don't Click Me.mp3",
} as const

type SoundKey = keyof typeof SOUND_FILES

interface TimerSettings {
  workMinutes: number
  breakMinutes: number
  nudges: boolean
  workdayStart: string
  workdayEnd: string
  nudgeInterval: 5 | 10 | 15 | 20
  desktopNotifications: boolean
  soundEnabled: boolean
  soundType: 'none' | SoundKey | 'custom'
  customSound?: string
  volume: number
}

const DEFAULT_SETTINGS: TimerSettings = {
  workMinutes: 25,
  breakMinutes: 5,
  nudges: true,
  workdayStart: '09:00',
  workdayEnd: '17:00',
  nudgeInterval: 15,
  desktopNotifications: true,
  soundEnabled: true,
  soundType: 'subtle',
  volume: 0.6,
}

const STORAGE_KEY = 'zuri.workday-timer'

const WorkdayTimer: React.FC<{ focusLabel?: string; tasks?: { text: string; completed: boolean }[] }> = ({ focusLabel, tasks = [] }) => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        const merged = { ...DEFAULT_SETTINGS, ...parsed } as TimerSettings & { soundType?: any }
        // Migrate older sound keys to new options
        if (merged.soundType === 'chime') merged.soundType = 'subtle' as any
        if (merged.soundType === 'bell') merged.soundType = 'soft' as any
        return merged as TimerSettings
      }
      return DEFAULT_SETTINGS
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
          playSound()
          toast(nextMode === 'break' ? 'Time for a short break' : 'Back to focus', {
            description: nextMode === 'break' ? 'Stand up, breathe, get water.' : 'Pick one task and go deep.'
          })
          if (settings.desktopNotifications) {
            showSystemNotification(
              nextMode === 'break' ? 'Time for a short break' : 'Back to focus',
              nextMode === 'break' ? 'Stand up, breathe, get water.' : 'Pick one task and go deep.'
            )
          }
        }
        return (nextMode === 'work' ? settings.workMinutes : settings.breakMinutes) * 60
      })

      // Periodic nudges during work mode
      setNudgeCounter((c) => {
        const next = c + 1
        if (mode === 'work' && settings.nudges && isWithinWorkday() && next >= settings.nudgeInterval * 60) {
          playSound()
          const msg = buildNudgeMessage()
          toast(msg)
          if (settings.desktopNotifications) {
            showSystemNotification('Nudge', msg)
          }
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

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playSound = () => {
    if (!settings.soundEnabled) return
    try {
      let src: string | undefined
      if (settings.soundType === 'none') return
      if (settings.soundType === 'custom' && settings.customSound) {
        src = settings.customSound
      } else if (settings.soundType && settings.soundType in SOUND_FILES) {
        const filename = SOUND_FILES[settings.soundType as SoundKey]
        src = `${SUPABASE_PUBLIC_BASE}/${SOUND_BUCKET}/${encodeURIComponent(filename)}`
      }
      if (!src) return
      if (!audioRef.current) {
        audioRef.current = new Audio()
        // Allow CORS for public files (not strictly needed for playback, but harmless)
        audioRef.current.crossOrigin = 'anonymous'
      }
      audioRef.current.src = src
      audioRef.current.volume = settings.volume
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    } catch {}
  }

  const buildNudgeMessage = () => {
    const total = settings.workMinutes * 60
    const elapsed = Math.max(0, total - secondsLeft)
    const elapsedMin = Math.floor(elapsed / 60)
    const [_, __] = settings.workdayStart.split(':')
    const [eH, eM] = settings.workdayEnd.split(':').map(Number)
    const now = new Date()
    const minutesNow = now.getHours() * 60 + now.getMinutes()
    const end = eH * 60 + eM
    const hoursLeft = Math.max(0, (end - minutesNow) / 60)
    const hoursLeftStr = hoursLeft.toFixed(1)
    const remainingTasks = (tasks || []).filter((t) => !t.completed)
    const taskCount = remainingTasks.length
    const taskList = remainingTasks.slice(0, 3).map((t) => t.text).join(', ')
    const name = focusLabel?.trim() || 'your focus'
    return `You're on ${name} — ${elapsedMin} minutes elapsed. ${hoursLeftStr} hours left in your workday, ${taskCount} tasks remain${taskCount ? ': ' + taskList : '.'}`
  }
  const handleTestNotification = async () => {
    const msg = buildNudgeMessage()
    const ok = await ensureNotificationPermission()
    if (!ok) {
      toast('Enable notifications', { description: 'Please allow notifications in your browser.' })
    }
    showSystemNotification('Test notification', msg)
    playSound()
  }

  return (
    <div id="workday-timer" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
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
  {/* Notifications */}
  <div className="grid grid-cols-2 gap-4 items-center">
    <div className="flex items-center justify-between">
      <Label htmlFor="desktop-notifs">Desktop notifications</Label>
      <Switch
        id="desktop-notifs"
        checked={settings.desktopNotifications}
        onCheckedChange={async (val) => {
          setSettings((s) => ({ ...s, desktopNotifications: val }))
          if (val) {
            const ok = await ensureNotificationPermission()
            if (!ok) {
              toast('Notifications blocked', { description: 'Please allow notifications in your browser.' })
            }
          }
        }}
      />
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="sound-enabled">Sound</Label>
      <Switch
        id="sound-enabled"
        checked={settings.soundEnabled}
        onCheckedChange={(val) => setSettings((s) => ({ ...s, soundEnabled: val }))}
      />
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="sound-type">Sound type</Label>
      <Select
        value={settings.soundType}
        onValueChange={(val) => setSettings((s) => ({ ...s, soundType: val as TimerSettings['soundType'] }))}
      >
        <SelectTrigger id="sound-type" className="h-8 mt-1">
          <SelectValue placeholder="Choose sound" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="ringtone90s">90s Ringtone</SelectItem>
          <SelectItem value="subtle">Subtle</SelectItem>
          <SelectItem value="soft">Soft</SelectItem>
          <SelectItem value="dontClickMe">Don't Click Me</SelectItem>
          <SelectItem value="custom">Custom upload</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="pt-6">
      <Label className="text-xs text-muted-foreground">Volume</Label>
      <div className="mt-2">
        <Slider
          value={[Math.round(settings.volume * 100)]}
          onValueChange={(v) => setSettings((s) => ({ ...s, volume: (v[0] ?? 60) / 100 }))}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  </div>

  {settings.soundType === 'custom' && (
    <div className="grid grid-cols-1 gap-2">
      <Label htmlFor="custom-sound">Upload custom sound</Label>
      <Input
        id="custom-sound"
        type="file"
        accept="audio/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = () => {
            const dataUrl = reader.result as string
            setSettings((s) => ({ ...s, customSound: dataUrl, soundType: 'custom' }))
          }
          reader.readAsDataURL(file)
        }}
      />
    </div>
  )}

  <div className="pt-2">
    <Button variant="secondary" onClick={handleTestNotification}>Test Notification</Button>
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
