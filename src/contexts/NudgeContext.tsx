import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

// ADHD-specific notes:
// - Nudges should be rare, contextually timed (debounced), and visually gentle.
// - Avoid flashy colors; prefer soft emphasis (e.g., subtle ring and shadow) respecting reduced motion.
// - Keep content concise (<200 chars) and actionable, reducing cognitive load.

export type NudgeVariant = "suggestion" | "encouragement" | "warning" | "celebration"

export interface NudgeItem {
  id: string
  nudgeText: string // max 200 chars enforced at enqueue
  nudgeType: NudgeVariant
  nudgeActionLabel?: string
  nudgeOnAction?: () => void
  // metadata for context bridging
  meta?: Record<string, any>
}

interface NudgeContextValue {
  queue: NudgeItem[]
  enqueue: (nudge: Omit<NudgeItem, "id"> & { id?: string }) => void
  dismiss: (id: string) => void
  clear: () => void
  // for tests
  __unsafe_forceSetQueue?: React.Dispatch<React.SetStateAction<NudgeItem[]>>
}

const NudgeContext = createContext<NudgeContextValue | undefined>(undefined)

const STORAGE_KEY = "zuri_nudges_dismissed_ids"
const QUEUE_KEY = "zuri_nudges_queue_cache"
const LAST_BREAK_KEY = "zuri_last_break_info" // for context bridge

function loadDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? (JSON.parse(raw) as string[]) : []
    return new Set(arr)
  } catch {
    return new Set<string>()
  }
}

function saveDismissed(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)))
  } catch { }
}

function loadQueueCache(): NudgeItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? (JSON.parse(raw) as NudgeItem[]) : []
  } catch {
    return []
  }
}

function saveQueueCache(queue: NudgeItem[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch { }
}

export interface NudgeProviderProps {
  children: React.ReactNode
  maxQueue?: number // default 3
  debounceMs?: number // default 500
}

export const NudgeProvider: React.FC<NudgeProviderProps> = ({
  children,
  maxQueue = 3,
  debounceMs = 500,
}) => {
  const [queue, setQueue] = useState<NudgeItem[]>(() => loadQueueCache())
  const dismissed = useRef<Set<string>>(loadDismissed())
  const debounceTimer = useRef<number | null>(null)

  // persist queue to LS
  useEffect(() => {
    saveQueueCache(queue)
  }, [queue])

  const commit = useCallback((pending: NudgeItem[]) => {
    // FIFO with max size
    const truncated = pending.slice(-maxQueue)
    setQueue(truncated)
  }, [maxQueue])

  const enqueue = useCallback(
    (nudge: Omit<NudgeItem, "id"> & { id?: string }) => {
      const id = nudge.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const text = (nudge.nudgeText ?? "").toString().slice(0, 200) // enforce 200 chars
      const next: NudgeItem = { ...nudge, id, nudgeText: text }
      if (dismissed.current.has(id)) return

      const apply = () => {
        setQueue((prev) => {
          const existing = prev.find((p) => p.id === id)
          if (existing) return prev // no duplicates
          return [...prev, next]
        })
      }

      if (debounceTimer.current) window.clearTimeout(debounceTimer.current)
      debounceTimer.current = window.setTimeout(apply, debounceMs)
    },
    [debounceMs]
  )

  const dismiss = useCallback((id: string) => {
    dismissed.current.add(id)
    saveDismissed(dismissed.current)
    setQueue((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clear = useCallback(() => {
    setQueue([])
  }, [])

  // Context Bridge: when user returns from a break, show resume nudge once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_BREAK_KEY)
      if (!raw) return
      const info = JSON.parse(raw) as { focus?: string; considering?: string; ts: number }
      // Only trigger shortly after return (within 5 minutes)
      if (Date.now() - info.ts < 5 * 60 * 1000) {
        enqueue({
          id: `resume-${info.ts}`,
          nudgeType: "encouragement",
          nudgeText: `You were working on ${info.focus ?? "your task"}, considering ${info.considering ?? "next steps"}. Ready to continue?`,
          nudgeActionLabel: "Resume",
          nudgeOnAction: () => {
            // Optionally emit a custom event other parts of app can listen to
            window.dispatchEvent(new CustomEvent("zuri:nudge:resume", { detail: info }))
          },
          meta: { bridge: true },
        })
      }
      // Clear so it only shows once per return
      localStorage.removeItem(LAST_BREAK_KEY)
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<NudgeContextValue>(() => ({
    queue,
    enqueue,
    dismiss,
    clear,
    __unsafe_forceSetQueue: setQueue,
  }), [queue, enqueue, dismiss, clear])

  return <NudgeContext.Provider value={value}>{children}</NudgeContext.Provider>
}

export function useNudges() {
  const ctx = useContext(NudgeContext)
  if (!ctx) throw new Error("useNudges must be used within NudgeProvider")
  return ctx
}

// Helper to record user's break context (to be called when they step away)
export function recordBreakContext(focus?: string, considering?: string) {
  try {
    localStorage.setItem(
      LAST_BREAK_KEY,
      JSON.stringify({ focus, considering, ts: Date.now() })
    )
  } catch { }
}
