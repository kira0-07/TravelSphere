import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DestinationCard({ destination, index = 0 }) {
  const { id, name, country, region, image, tags, rating } = destination;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/destinations/${id}`} className="group block">
        <div className="relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer">
          {/* Photo */}
          <img
            src={image}
            alt={`${name}, ${country}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 destination-card-overlay" />

          {/* Hover shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-white" />

          {/* Region chip — top right */}
          <div className="absolute top-3 right-3">
            <span className="chip chip-white text-xs">{region}</span>
          </div>

          {/* Content — bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="chip chip-white text-xs">{tag}</span>
              ))}
            </div>

            {/* Name & Country */}
            <h3 className="font-display font-semibold text-headline-sm text-white leading-tight">
              {name}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <p className="text-white/80 text-sm font-body">{country}</p>
              {rating && (
                <div className="flex items-center gap-1 text-secondary-container">
                  <span className="text-xs">★</span>
                  <span className="text-sm font-semibold text-white">{rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
