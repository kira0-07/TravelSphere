import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiSun, FiArrowLeft, FiCheck } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotFound from './NotFound';
import { destinationsAPI, packagesAPI, hotelsAPI } from '../services/api';
import PackageCard from '../components/PackageCard';
import HotelCard from '../components/HotelCard';

export default function DestinationDetail() {
  const { id } = useParams();
  
  const [destination, setDestination] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [relatedHotels, setRelatedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, packagesRes, hotelsRes] = await Promise.all([
          destinationsAPI.getById(id),
          packagesAPI.getAll({ destination: id }),
          hotelsAPI.getByDestination(id)
        ]);
        
        setDestination(destRes.data);
        
        // Ensure we filter safely in case backend doesn't filter perfectly
        const pkgs = packagesRes.data.filter(p => p.destinationId === id).slice(0, 3);
        setRelatedPackages(pkgs);
        
        const htls = hotelsRes.data.filter(h => h.destinationId === id).slice(0, 3);
        setRelatedHotels(htls);
        
      } catch (err) {
        console.error('Failed to fetch destination data', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center section-surface"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !destination) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${destination.heroImage || destination.image}')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 hero-gradient-overlay" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <Link to="/#globe-destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium w-fit transition-colors">
            <FiArrowLeft /> Back to Destinations
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="chip chip-teal backdrop-blur-md bg-white/10 text-white border border-white/20">{destination.region}</span>
            {destination.tags?.map(tag => (
              <span key={tag} className="chip bg-black/30 text-white backdrop-blur-md border border-white/10">{tag}</span>
            ))}
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-display-lg text-white mb-2 leading-tight">
            {destination.name}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white text-sm">
            <span className="flex items-center gap-1.5"><FiMapPin className="text-primary-fixed-dim" /> {destination.country}</span>
            <span className="flex items-center gap-1.5"><FiStar className="text-secondary-fixed" /> {destination.rating} ({destination.reviewCount} Reviews)</span>
            <span className="flex items-center gap-1.5"><FiSun className="text-secondary-fixed-dim" /> {destination.climate}</span>
          </div>
        </div>
      </section>

      <main className="flex-1 section-surface py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="font-display font-bold text-headline-sm text-on-surface mb-4">About {destination.name}</h2>
                <p className="text-on-surface-variant leading-relaxed text-body-lg">
                  {destination.description}
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-headline-sm text-on-surface mb-4">Top Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.highlights?.map((highlight, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-lowest shadow-ambient border border-outline-variant/10"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiCheck className="text-primary text-sm" />
                      </div>
                      <span className="font-medium text-on-surface text-sm">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-display font-semibold text-title-md text-on-surface mb-4">Best Time to Visit</h3>
                <div className="flex flex-wrap gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => {
                    const isBest = destination.bestMonths?.includes(month);
                    return (
                      <span 
                        key={month} 
                        className={`text-xs font-medium px-3 py-1.5 rounded-sm flex-1 text-center min-w-[25%] transition-colors
                          ${isBest ? 'bg-primary text-white shadow-ambient' : 'bg-surface-container text-on-surface-variant'}`
                        }
                      >
                        {month}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Related Packages */}
          {relatedPackages.length > 0 && (
            <section className="mt-20">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="font-display font-bold text-headline-md text-on-surface">Tour Packages in {destination.name}</h2>
                  <div className="section-title-underline" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPackages.map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} index={i} />)}
              </div>
            </section>
          )}

          {/* Related Hotels */}
          {relatedHotels.length > 0 && (
            <section className="mt-20">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="font-display font-bold text-headline-md text-on-surface">Places to Stay</h2>
                  <div className="section-title-underline" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedHotels.map((hotel, i) => <HotelCard key={hotel.id} hotel={hotel} index={i} />)}
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
