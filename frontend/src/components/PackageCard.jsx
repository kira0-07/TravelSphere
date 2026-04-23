import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiUsers } from 'react-icons/fi';

const BADGE_STYLES = {
  'Best Seller': 'bg-secondary-container text-[#4a2e00]',
  'Trending': 'bg-primary/10 text-primary',
  'Luxury': 'bg-tertiary-fixed/30 text-tertiary',
  'Adventure': 'bg-blue-100 text-blue-700',
  'Seasonal': 'bg-green-100 text-green-700',
};

export default function PackageCard({ pkg, index = 0 }) {
  const { id, title, destination, image, duration, groupSize, price, originalPrice, rating, reviewCount, badge, tags } = pkg;

  const badgeStyle = BADGE_STYLES[badge] || 'bg-surface-container text-on-surface-variant';
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card group"
    >
      <Link to={`/packages/${id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-lg aspect-video">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
            loading="lazy"
          />

          {/* Badge */}
          {badge && (
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
              {badge}
            </div>
          )}

          {/* Discount */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-error text-white text-xs font-bold px-2 py-1 rounded-sm">
              -{discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="chip chip-teal text-xs">{tag}</span>
            ))}
          </div>

          <h3 className="font-display font-semibold text-headline-sm text-on-surface mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">{destination}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-4">
            <span className="flex items-center gap-1.5">
              <FiClock className="text-primary" /> {duration} days
            </span>
            <span className="flex items-center gap-1.5">
              <FiUsers className="text-primary" /> {groupSize.min}–{groupSize.max} people
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-secondary-container' : 'text-surface-container-highest'}`}>★</span>
            ))}
            <span className="text-xs text-on-surface-variant ml-1">({reviewCount?.toLocaleString()})</span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-on-surface-variant">From</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-xl text-primary">${price?.toLocaleString()}</span>
                {originalPrice && (
                  <span className="text-xs text-on-surface-variant line-through">${originalPrice?.toLocaleString()}</span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant">per person</p>
            </div>
            <span className="btn-primary py-2 px-4 text-xs">
              Book Now
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
