import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist submission here
    setIsSubmitted(true);
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-light text-foreground mb-6 leading-tight">
            Join the beta
          </h2>
          <p className="text-xl text-text-subtle">
            Be among the first to experience ADHD-friendly AI assistance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-input border-border focus:border-glow-primary focus:ring-glow-primary/20 rounded-xl px-6 py-4 text-lg"
              />
              <Button 
                type="submit"
                className="bg-glow-primary text-primary-foreground hover:bg-glow-secondary transition-all duration-300 px-8 py-4 text-lg font-medium rounded-xl shadow-glow hover:shadow-elevated whitespace-nowrap"
              >
                Join waitlist
              </Button>
            </form>
          ) : (
            <motion.div
              className="bg-gradient-surface border border-glow-primary/30 rounded-2xl p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-glow-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-glow-primary rounded-full animate-glow-pulse" />
              </div>
              <h3 className="text-xl font-display text-text-emphasis mb-2">You're on the list!</h3>
              <p className="text-text-subtle">We'll reach out soon with early access</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Waitlist;