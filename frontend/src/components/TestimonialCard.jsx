import { motion } from 'framer-motion';

export default function TestimonialCard({ testimonial, index = 0 }) {
  const { name, destination, avatar, rating, quote, tripType, date } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-surface-container-lowest rounded-lg p-6 flex flex-col gap-5"
      style={{ boxShadow: '0 4px 24px rgba(25, 28, 30, 0.06), 0 1px 4px rgba(25, 28, 30, 0.04)' }}
    >
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-secondary-container' : 'text-surface-container-highest'}`}>★</span>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="font-body text-sm text-on-surface-variant leading-relaxed italic flex-1">
        "{quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold font-display text-on-surface">{name}</p>
          <p className="text-xs text-on-surface-variant">{destination} · {date}</p>
        </div>
        {tripType && (
          <span className="ml-auto chip chip-teal text-xs">{tripType}</span>
        )}
      </div>
    </motion.div>
  );
}
