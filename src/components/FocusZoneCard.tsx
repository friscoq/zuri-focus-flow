import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFocus } from "@/contexts/FocusContext";
import { toast } from "@/components/ui/sonner";
import { celebrate } from "@/lib/confetti";

const FocusZoneCard: React.FC = () => {
  const { focusIntent, setFocusIntent, clearMind } = useFocus();

  const startFocus = () => {
    toast("Focus started", { description: focusIntent ? `Intent: ${focusIntent}` : "You got this." });
    document.getElementById("workday-timer")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClear = () => {
    clearMind();
    celebrate();
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle>Your Focus Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Define your next focus and start a calm, time‑boxed session.</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-2">
          <Input
            id="focus-intent-input"
            value={focusIntent}
            onChange={(e) => setFocusIntent(e.target.value)}
            placeholder="What will you focus on next?"
            className="flex-1"
            aria-label="Focus intent"
          />
          <Button
            onClick={startFocus}
            disabled={!focusIntent.trim()}
            className="hover-scale focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Start focus
          </Button>
          <Button
            variant="outline"
            onClick={() => document.getElementById('workday-timer')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover-scale focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Timer settings
          </Button>
        </div>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={handleClear}
            className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Clear my mind"
          >
            Clear My Mind
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusZoneCard;
