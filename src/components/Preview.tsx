import { motion } from "framer-motion";

const Preview = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-light text-foreground mb-6 leading-tight">
            Preview the difference
          </h2>
          <p className="text-xl text-text-subtle max-w-2xl mx-auto">
            See how Zuri transforms overwhelming tasks into manageable moments
          </p>
        </motion.div>

        {/* Mock UI Preview */}
        <motion.div
          className="relative bg-gradient-surface p-1 rounded-3xl shadow-ambient border border-border/50"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="bg-surface-overlay rounded-3xl p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-glow-primary rounded-full animate-glow-pulse" />
                <span className="text-glow-primary font-medium">Zuri is here to help</span>
              </div>
              <h3 className="text-2xl font-display text-text-emphasis">Good morning! Ready to tackle today?</h3>
            </div>

            {/* Suggestion cards */}
            <div className="space-y-4 mb-8">
              {[
                "Start with your easiest task to build momentum",
                "Take a 5-minute break - you've been focused for 45 minutes",
                "Your energy seems high right now, perfect time for that important call"
              ].map((suggestion, index) => (
                <motion.div
                  key={index}
                  className="bg-muted/30 border border-border/30 rounded-xl p-4 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <p className="text-text-subtle text-sm leading-relaxed">{suggestion}</p>
                </motion.div>
              ))}
            </div>

            {/* Chat input mockup */}
            <motion.div
              className="bg-input border border-border rounded-xl p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-glow-primary rounded-full animate-pulse" />
              <span className="text-text-subtle text-sm">Ask Zuri anything...</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Preview;