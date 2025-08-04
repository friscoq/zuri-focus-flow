import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Morphic background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-morphic rounded-full animate-morphic opacity-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-morphic rounded-full animate-morphic opacity-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          style={{ animationDelay: "10s" }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Logo with glow effect */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-glow-primary rounded-full blur-xl animate-glow-pulse" />
            <div className="relative text-6xl font-display font-bold text-glow-primary tracking-tight">
              Zuri
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="space-y-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-light text-foreground leading-[1.1] tracking-tight">
            Work That Flows,
            <br />
            <span className="text-text-emphasis">plan smarter</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-subtle max-w-2xl mx-auto leading-relaxed font-light">
            Your dopamine-friendly AI assistant that understands ADHD minds
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button 
            size="lg" 
            className="bg-glow-primary text-primary-foreground hover:bg-glow-secondary transition-all duration-300 px-12 py-6 text-lg font-medium rounded-xl shadow-glow hover:shadow-elevated"
          >
            Join the waitlist
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;