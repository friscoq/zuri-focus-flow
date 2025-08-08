import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFocus } from "@/contexts/FocusContext";
import { celebrate } from "@/lib/confetti";
import { toast } from "@/components/ui/sonner";

const QuickCapture: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { addCapture } = useFocus();
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("zuri:quick-capture:open", handler as EventListener);
    return () => window.removeEventListener("zuri:quick-capture:open", handler as EventListener);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => ref.current?.focus(), 0);
    } else {
      setText("");
    }
  }, [open]);

  const save = () => {
    const clean = text.trim();
    if (!clean) {
      toast("Nothing to save", { description: "Type a quick thought and press Enter." });
      return;
    }
    addCapture(clean);
    celebrate({ particles: 40 });
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-label="Quick Capture" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Capture</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Textarea
            ref={ref}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={4}
            placeholder="What’s in your head? Brain dump here…"
            aria-label="Quick capture input"
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </div>
          <p className="text-xs text-muted-foreground">Tip: Press Enter to save, Shift+Enter for a new line.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCapture;
