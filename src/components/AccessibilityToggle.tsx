import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AccessibilityToggle = () => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <Button
        onClick={() => setHighContrast(!highContrast)}
        variant="secondary"
        size="sm"
        className="bg-surface-overlay border border-border hover:border-glow-primary/50 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-glow-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Toggle high contrast mode"
      >
        {highContrast ? "Normal contrast" : "High contrast"}
      </Button>
    </motion.div>
  );
};

export default AccessibilityToggle;