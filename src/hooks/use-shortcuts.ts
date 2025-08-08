import { useEffect } from "react";
import { useFocus } from "@/contexts/FocusContext";

function isTypingInEditable(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  const editable = (el as HTMLElement).isContentEditable;
  return editable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export default function useShortcuts() {
  const { clearMind } = useFocus();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (isTypingInEditable(e)) return;

      // Cmd/Ctrl + J => Quick Capture
      if (e.key.toLowerCase() === "j") {
        e.preventDefault();
        window.dispatchEvent(new Event("zuri:quick-capture:open"));
        return;
      }
      // Cmd/Ctrl + K => Clear My Mind
      if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        clearMind();
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clearMind]);
}
