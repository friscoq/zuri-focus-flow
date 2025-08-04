import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

const faqData = [
  {
    question: "How does Zuri help with ADHD focus?",
    answer: "Zuri reduces decision fatigue with gentle AI suggestions, breaks tasks into manageable steps, and adapts to your energy levels throughout the day."
  },
  {
    question: "Will Zuri overwhelm me with notifications?",
    answer: "No. Zuri uses subtle nudges and respects your focus time. You control when and how you receive suggestions."
  },
  {
    question: "How is this different from other productivity apps?",
    answer: "Zuri is specifically designed for ADHD minds—it works with your brain patterns, not against them. No rigid schedules or overwhelming features."
  },
  {
    question: "Can I use Zuri during hyperfocus sessions?",
    answer: "Yes. Zuri's minimal focus mode removes all distractions while quietly tracking your progress in the background."
  },
  {
    question: "What if I forget to use it?",
    answer: "Zuri gently reminds you without being pushy. It learns your patterns and suggests check-ins at natural moments."
  },
  {
    question: "Is my data private?",
    answer: "Absolutely. Your personal patterns and information stay secure and are never shared. You're in control of your data."
  }
];

const FAQDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating FAQ Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-surface/80 backdrop-blur-sm border border-border/30 hover:bg-surface/90 shadow-soft transition-all duration-300 group"
          aria-label="Open FAQ"
        >
          <HelpCircle className="w-6 h-6 text-text-subtle group-hover:text-glow-primary transition-colors" />
        </Button>
      </motion.div>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="bg-surface/95 backdrop-blur-lg border-t border-border/30 max-h-[80vh]">
          <DrawerHeader className="border-b border-border/20 pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-display text-text-emphasis">
                Frequently Asked
              </DrawerTitle>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-subtle hover:text-text-emphasis"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto">
            <div className="space-y-6 max-w-2xl mx-auto">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-surface border border-border/20 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <h3 className="text-lg font-display text-text-emphasis mb-3 leading-relaxed">
                    {faq.question}
                  </h3>
                  <p className="text-text-subtle leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 pt-6 border-t border-border/20">
              <p className="text-text-subtle text-sm">
                More questions? We're here to help when you join the beta.
              </p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FAQDrawer;