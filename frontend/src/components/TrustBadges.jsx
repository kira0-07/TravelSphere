import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { trustStats } from '../data/mockData';

function AnimatedCounter({ value, suffix = '' }) {
  const [displayed, setDisplayed] = useState('0');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    // Just animate the display, since values are strings like "10,000+" or "4.9"
    const timer = setTimeout(() => setDisplayed(value), 300);
    return () => clearTimeout(timer);
  }, [isInView, value]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="font-display font-bold text-3xl md:text-4xl text-primary"
    >
      {displayed}{suffix}
    </motion.span>
  );
}

export default function TrustBadges() {
  return (
    <section className="section-low py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                {stat.icon}
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-on-surface-variant font-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
