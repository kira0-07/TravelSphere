import { motion } from 'framer-motion';
import { hotels } from '../data/mockData';
import HotelCard from './HotelCard';

export default function HotelsParallax() {
  return (
    <section id="hotels" className="relative w-full py-32 bg-surface overflow-hidden flex flex-col items-center justify-center">
      
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface z-10" />
      </div>

      <div className="relative z-10 text-center px-4 mb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-secondary font-medium tracking-[0.1em] uppercase text-sm mb-4"
        >
          Exclusive Accommodations
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-5xl text-on-surface leading-tight"
        >
          Stay in <span className="text-primary">Luxury</span>
        </motion.h2>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.slice(0, 3).map((hotel, index) => (
            <HotelCard key={hotel.id} hotel={hotel} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}


