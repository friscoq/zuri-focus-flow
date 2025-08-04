import { motion } from "framer-motion";

const features = [
  {
    title: "AI Suggestion Bar",
    description: "Gentle nudges that appear exactly when you need them, not when they overwhelm",
    highlight: "Context-aware assistance"
  },
  {
    title: "Ask Zuri Chat",
    description: "Natural conversations that help you break down complex tasks into manageable steps",
    highlight: "ADHD-friendly planning"
  },
  {
    title: "Dopamine Planning",
    description: "Task scheduling that works with your energy levels, not against them",
    highlight: "Energy-based workflow"
  },
  {
    title: "Mood Nudges",
    description: "Emotional check-ins that help you understand patterns and make better choices",
    highlight: "Self-awareness tools"
  },
  {
    title: "Focus Mode",
    description: "Distraction-free environment that adapts to your attention span",
    highlight: "Minimal interface"
  },
  {
    title: "Smart Triggers",
    description: "Intelligent reminders based on context, location, and your personal patterns",
    highlight: "Adaptive reminders"
  }
];

const Features = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-light text-foreground mb-6 leading-tight">
            How Zuri helps
          </h2>
          <p className="text-xl text-text-subtle max-w-2xl mx-auto">
            Designed specifically for minds that think differently
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-surface-elevated p-8 rounded-2xl border border-border/50 hover:border-glow-primary/30 transition-all duration-500 hover:shadow-glow/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="mb-4">
                <span className="text-sm font-medium text-glow-primary bg-glow-primary/10 px-3 py-1 rounded-full border border-glow-primary/20">
                  {feature.highlight}
                </span>
              </div>
              
              <h3 className="text-xl font-display font-medium text-text-emphasis mb-4 group-hover:text-foreground transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-text-subtle leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;