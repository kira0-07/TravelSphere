import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiCheck, FiArrowLeft, FiImage, FiWifi, FiCoffee, FiWind, FiHeart } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotFound from './NotFound';
import { hotelsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await hotelsAPI.getById(id);
        setHotel(res.data);
      } catch (err) {
        console.error('Failed to fetch hotel', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center section-surface"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !hotel) return <NotFound />;

  // Map amenities to icons where possible
  const getIconForAmenity = (amenity) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi')) return <FiWifi />;
    if (a.includes('pool') || a.includes('spa')) return <FiWind />;
    if (a.includes('restaurant') || a.includes('breakfast') || a.includes('room service')) return <FiCoffee />;
    if (a.includes('view')) return <FiImage />;
    return <FiCheck />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 section-surface pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/#hotels" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6 text-sm font-medium transition-colors">
            <FiArrowLeft /> Back to Hotels
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="chip chip-amber">{hotel.type}</span>
                <div className="flex text-secondary text-sm">
                  {[...Array(hotel.stars)].map((_, i) => <span key={i}>★</span>)}
                </div>
              </div>
              <h1 className="font-display font-bold text-3xl md:text-5xl text-on-surface mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-x-6 text-on-surface-variant text-sm">
                <span className="flex items-center gap-1.5"><FiMapPin className="text-primary" /> {hotel.destination}</span>
                <span className="flex items-center gap-1.5 text-on-surface font-semibold"><FiStar className="text-secondary" /> {hotel.rating} <span className="text-on-surface-variant font-normal">({hotel.reviewCount} reviews)</span></span>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-on-surface-variant">Starting from</p>
              <div className="text-3xl font-display font-bold text-primary">${hotel.pricePerNight} <span className="text-sm font-normal text-on-surface-variant">/night</span></div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 h-[400px] md:h-[500px]">
            <div className="md:col-span-2 h-full rounded-2xl overflow-hidden relative group">
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity" />
            </div>
            <div className="hidden md:grid gap-4 grid-rows-2 h-full">
              <div className="rounded-2xl overflow-hidden relative group">
                {/* Secondary mockup images just use main with different filters for demo */}
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover filter brightness-110 contrast-125 transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="rounded-2xl overflow-hidden relative group">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover filter saturate-150 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <button className="btn-secondary blur-none">View All Photos</button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-10">
              {/* Amenities */}
              <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient border border-outline-variant/10">
                <h2 className="font-display font-bold text-headline-sm text-on-surface mb-6">Popular Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  {hotel.amenities?.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3 text-on-surface-variant">
                      <div className="text-primary text-xl">
                        {getIconForAmenity(amenity)}
                      </div>
                      <span className="font-medium text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* About description (stub text) */}
              <section>
                <h2 className="font-display font-bold text-headline-sm text-on-surface mb-4">About the Property</h2>
                <div className="prose prose-sm md:prose-base dark:prose-invert text-on-surface-variant max-w-none">
                  <p>
                    Experience world-class service at {hotel.name}. Set in the beautiful region of {hotel.destination}, this {hotel.stars}-star {hotel.type.toLowerCase()} offers an unforgettable stay. Guests can enjoy premium amenities including {hotel.amenities?.slice(0, 3).join(', ').toLowerCase()} and more.
                  </p>
                  <p>
                    Each carefully designed accommodation provides comfort and luxury. Whether you are traveling for business or leisure, our property provides the perfect backdrop for your journey. The prime location allows easy access to local attractions.
                  </p>
                </div>
              </section>
            </div>

            {/* Informational Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-surface-container-lowest rounded-2xl p-6 shadow-ambient-lg border border-outline-variant/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-lg text-on-surface">Curated Stays</h3>
                  <div className="bg-primary/10 text-primary p-2 rounded-full cursor-pointer hover:bg-primary/20 transition-colors">
                    <FiHeart />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    This premium property is exclusively available as part of our curated travel packages. We handle all the booking details so you can focus on the experience.
                  </p>
                </div>

                <button 
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="btn-primary w-full py-4 text-base shadow-ambient-md hover:shadow-ambient-lg mb-4"
                >
                  Explore Packages
                </button>

                <ul className="space-y-2 text-xs text-on-surface-variant text-center">
                  <li>✔ Included in curated itineraries</li>
                  <li>✔ Handpicked for premium quality</li>
                  <li>✔ Guaranteed reservations</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
