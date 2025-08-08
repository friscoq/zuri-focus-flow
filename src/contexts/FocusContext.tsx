import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useNudges, recordBreakContext } from "@/contexts/NudgeContext";

export interface CaptureItem {
  id: string;
  text: string;
  ts: number;
}

interface FocusContextValue {
  focusIntent: string;
  setFocusIntent: (text: string) => void;
  captures: CaptureItem[];
  addCapture: (text: string) => void;
  clearMind: () => void;
}

const FocusContext = createContext<FocusContextValue | undefined>(undefined);
const STORAGE_KEY = "zuri_focus_ctx";

function loadState(): { focusIntent: string; captures: CaptureItem[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { focusIntent: "", captures: [] };
    const parsed = JSON.parse(raw);
    return {
      focusIntent: typeof parsed.focusIntent === "string" ? parsed.focusIntent : "",
      captures: Array.isArray(parsed.captures) ? parsed.captures : [],
    };
  } catch {
    return { focusIntent: "", captures: [] };
  }
}

function saveState(state: { focusIntent: string; captures: CaptureItem[] }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [focusIntent, setFocusIntent] = useState<string>(() => loadState().focusIntent);
  const [captures, setCaptures] = useState<CaptureItem[]>(() => loadState().captures);
  const { enqueue } = useNudges();

  useEffect(() => {
    saveState({ focusIntent, captures });
  }, [focusIntent, captures]);

  const addCapture = useCallback((text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const item: CaptureItem = { id: `${Date.now()}`, text: clean, ts: Date.now() };
    setCaptures((prev) => [item, ...prev].slice(0, 100));
    toast("Saved to Quick Capture", { description: clean.slice(0, 120) });
  }, []);

  const clearMind = useCallback(() => {
    try {
      if (focusIntent?.trim()) {
        // Record context bridge so we can resume later
        recordBreakContext(focusIntent, captures[0]?.text);
      }
      setFocusIntent("");
      enqueue({
        id: `clear-${Date.now()}`,
        nudgeType: "encouragement",
        nudgeText: "Nice reset. When you’re ready, pick one small next step.",
        nudgeActionLabel: "Set intent",
        nudgeOnAction: () => {
          // focus the intent input if present
          const el = document.getElementById("focus-intent-input") as HTMLInputElement | null;
          el?.focus();
        },
      });
      toast("Mind cleared", { description: "Fresh start. What’s the next tiny step?" });
      // Emit event for any listeners (e.g., confetti)
      window.dispatchEvent(new Event("zuri:focus:cleared"));
    } catch (e) {
      toast("Couldn’t clear right now", { description: "Please try again." });
    }
  }, [captures, enqueue, focusIntent]);

  const value = useMemo(
    () => ({ focusIntent, setFocusIntent, captures, addCapture, clearMind }),
    [focusIntent, captures, addCapture, clearMind]
  );

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};

export function useFocus() {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error("useFocus must be used within FocusProvider");
  return ctx;
}
