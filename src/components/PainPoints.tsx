import { motion } from "framer-motion";

const painPoints = [
  {
    title: "Executive function chaos",
    description: "Starting tasks feels impossible when your brain won't cooperate"
  },
  {
    title: "Overwhelm paralysis", 
    description: "Too many options freeze you in place instead of helping"
  },
  {
    title: "Planning that doesn't stick",
    description: "Traditional productivity tools ignore how ADHD minds actually work"
  }
];

const PainPoints = () => {
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
            We get it
          </h2>
          <p className="text-xl text-text-subtle max-w-2xl mx-auto">
            Living with ADHD means traditional productivity advice just doesn't work
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              className="bg-gradient-surface p-8 rounded-2xl border border-border shadow-ambient hover:shadow-elevated transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-display font-medium text-text-emphasis mb-4">
                {point.title}
              </h3>
              <p className="text-text-subtle leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;