import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiWifi, FiDroplet } from 'react-icons/fi';
import { MdOutlineSpa, MdOutlineRestaurant, MdFitnessCenter } from 'react-icons/md';

const AMENITY_ICONS = {
  'WiFi': FiWifi,
  'Pool': FiDroplet,
  'Spa': MdOutlineSpa,
  'Restaurant': MdOutlineRestaurant,
  'Fitness Center': MdFitnessCenter,
};

export default function HotelCard({ hotel, index = 0 }) {
  const { id, name, destination, image, stars, rating, reviewCount, pricePerNight, amenities, type } = hotel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card group"
    >
      <Link to={`/hotels/${id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-lg aspect-video">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="chip chip-white text-xs">{type}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(stars)].map((_, i) => (
              <span key={i} className="text-secondary-container text-sm">★</span>
            ))}
          </div>

          <h3 className="font-display font-semibold text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-1">
            {name}
          </h3>
          <p className="text-sm text-on-surface-variant mb-3">{destination}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-xs">{rating}</span>
            <span className="text-xs text-on-surface-variant">{reviewCount?.toLocaleString()} reviews</span>
          </div>

          {/* Amenity chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenities?.slice(0, 4).map((amenity) => (
              <span key={amenity} className="chip chip-teal text-xs">{amenity}</span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <span className="font-display font-bold text-xl text-primary">${pricePerNight?.toLocaleString()}</span>
              <span className="text-xs text-on-surface-variant ml-1">/ night</span>
            </div>
            <span className="btn-primary py-2 px-4 text-xs">View Hotel</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
