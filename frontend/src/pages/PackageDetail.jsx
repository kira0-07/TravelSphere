import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiClock, FiUsers, FiCheck, FiX, FiArrowLeft, FiNavigation } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotFound from './NotFound';
import { useAuth } from '../hooks/useAuth';
import { bookingsAPI, packagesAPI } from '../services/api';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [travelers, setTravelers] = useState(() => {
    const stored = localStorage.getItem('travelers');
    return stored ? parseInt(stored) : 1;
  });
  const [dateRange, setDateRange] = useState(() => {
    const storedStart = localStorage.getItem('search_startDate');
    const storedEnd = localStorage.getItem('search_endDate');
    return [
      storedStart ? new Date(storedStart) : null,
      storedEnd ? new Date(storedEnd) : null
    ];
  });
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await packagesAPI.getById(id);
        setPkg(res.data);
      } catch (err) {
        console.error('Failed to fetch package', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  // Ensure travelers respects package group size limits (only max)
  useEffect(() => {
    if (pkg) {
      setTravelers(t => {
        return Math.max(1, Math.min(pkg.groupSize.max, t));
      });
    }
  }, [pkg]);

  let calculatedDuration = pkg?.duration || 0;
  if (startDate && endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      calculatedDuration = diffDays;
    }
  }

  let calculatedPrice = pkg?.price || 0;
  if (pkg && startDate && endDate && calculatedDuration > 0) {
    const pricePerDay = pkg.price / pkg.duration;
    calculatedPrice = Math.round(pricePerDay * calculatedDuration);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center section-surface"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !pkg) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${pkg.image}')` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 hero-gradient-overlay" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <Link to="/#packages" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium w-fit transition-colors">
            <FiArrowLeft /> Back to Packages
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {pkg.badge && (
              <span className="chip bg-secondary text-white border border-secondary shadow-ambient">{pkg.badge}</span>
            )}
            <span className="chip chip-teal backdrop-blur-md bg-white/10 text-white border border-white/20">{pkg.difficulty}</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-display-lg text-white mb-4 leading-tight max-w-4xl">
            {pkg.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-white text-sm font-medium">
            <span className="flex items-center gap-2"><FiMapPin className="text-primary-fixed-dim" /> {pkg.destination}</span>
            <span className="flex items-center gap-2"><FiClock className="text-primary-fixed-dim" /> {calculatedDuration} Days</span>
            <span className="flex items-center gap-2"><FiUsers className="text-primary-fixed-dim" /> Up to {pkg.groupSize.max} People</span>
            <span className="flex items-center gap-2"><FiStar className="text-secondary-fixed" /> {pkg.rating} ({pkg.reviewCount} Reviews)</span>
          </div>
        </div>
      </section>

      <main className="flex-1 section-surface py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            
            {/* Left Content (Itinerary + Details) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {pkg.tags?.map(tag => (
                  <span key={tag} className="chip bg-surface-container text-on-surface-variant font-medium">{tag}</span>
                ))}
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-ambient">
                  <h3 className="font-display font-bold text-title-md text-on-surface mb-4 flex items-center gap-2">
                    <FiCheck className="text-primary" /> What's Included
                  </h3>
                  <ul className="space-y-3 text-sm text-on-surface-variant">
                    {pkg.includes?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1 text-xs">◆</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-ambient">
                  <h3 className="font-display font-bold text-title-md text-on-surface mb-4 flex items-center gap-2">
                    <FiX className="text-error" /> Not Included
                  </h3>
                  <ul className="space-y-3 text-sm text-on-surface-variant">
                    {pkg.excludes?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-error mt-1 text-xs">◆</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Itinerary */}
              {pkg.itinerary?.length > 0 && (
                <section>
                  <h2 className="font-display font-bold text-headline-md text-on-surface mb-8">Tour Itinerary</h2>
                  <div className="space-y-6">
                    {pkg.itinerary.map((day, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-6"
                      >
                        {/* Timeline Graphic */}
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm z-10 shrink-0">
                            {day.day}
                          </div>
                          {i !== pkg.itinerary.length - 1 && (
                            <div className="w-px h-full bg-outline-variant/30 mt-2 mb-[-1.5rem]" />
                          )}
                        </div>
                        {/* Day Content */}
                        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-ambient flex-1 pb-8">
                          <h4 className="font-display font-bold text-title-md text-on-surface mb-3">{day.title}</h4>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2 text-xs">Activities</p>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {day.activities?.map((act, j) => (
                                  <li key={j} className="text-sm text-on-surface-variant flex items-center gap-2">
                                    <FiNavigation className="text-primary text-xs" /> {act}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="pt-3 border-t border-outline-variant/20">
                              <p className="text-sm text-on-surface-variant"><span className="font-semibold text-on-surface">Stay:</span> {day.accommodation}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Sticky Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-surface-container-lowest rounded-2xl p-6 shadow-ambient-lg border border-outline-variant/20">
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-outline-variant/20">
                  <div>
                    <span className="text-sm text-on-surface-variant font-medium line-through mr-2">${pkg.originalPrice}</span>
                    <div className="flex items-end gap-1 text-primary">
                      <span className="text-3xl font-display font-bold">${calculatedPrice}</span>
                      <span className="text-sm text-on-surface-variant mb-1">/person</span>
                    </div>
                  </div>
                  {pkg.originalPrice && (
                    <div className="bg-error/10 text-error text-xs font-bold px-2 py-1 rounded-sm">
                      {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6 text-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold text-on-surface">{calculatedDuration} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Group Size</span>
                    <span className="font-semibold text-on-surface">Up to {pkg.groupSize.max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty</span>
                    <span className="font-semibold text-on-surface">{pkg.difficulty}</span>
                  </div>
                </div>

                {/* Dates Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-on-surface mb-2">Select Travel Dates</label>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update);
                      const [start, end] = update;
                      if (start) localStorage.setItem('search_startDate', start.toISOString());
                      else localStorage.removeItem('search_startDate');
                      if (end) localStorage.setItem('search_endDate', end.toISOString());
                      else localStorage.removeItem('search_endDate');
                    }}
                    minDate={new Date()}
                    monthsShown={1}
                    placeholderText="Check-in - Check-out"
                    className="w-full bg-surface-container rounded-md p-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/50 border border-outline-variant/30"
                    wrapperClassName="w-full"
                  />
                </div>

                {/* Travelers Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-on-surface mb-2">Number of Travelers</label>
                  <div className="flex items-center gap-4 bg-surface-container rounded-sm p-1 w-max">
                    <button 
                      onClick={() => {
                        const val = Math.max(1, travelers - 1);
                        setTravelers(val);
                        localStorage.setItem('travelers', val);
                      }}
                      disabled={travelers <= 1}
                      className="w-8 h-8 rounded text-on-surface hover:bg-surface-container-high disabled:opacity-50 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-semibold text-on-surface">{travelers}</span>
                    <button 
                      onClick={() => {
                        const val = Math.min(pkg.groupSize.max, travelers + 1);
                        setTravelers(val);
                        localStorage.setItem('travelers', val);
                      }}
                      disabled={travelers >= pkg.groupSize.max}
                      className="w-8 h-8 rounded text-on-surface hover:bg-surface-container-high disabled:opacity-50 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-outline-variant/20 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-on-surface-variant font-medium">Total Amount</span>
                    <span className="text-2xl font-display font-bold text-primary">${(calculatedPrice * travelers).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant text-right">Includes all taxes & fees</p>
                </div>

                <button 
                  onClick={async () => {
                    if (!startDate || !endDate) {
                      toast.error('Please select your travel dates');
                      return;
                    }
                    if (!isAuthenticated) {
                      navigate('/login?redirect=booking');
                      return;
                    }
                    try {
                      await bookingsAPI.create({
                        packageId: pkg.id,
                        packageTitle: pkg.title,
                        destination: pkg.destination,
                        image: pkg.image,
                        startDate,
                        endDate,
                        travelers: travelers,
                        totalAmount: calculatedPrice * travelers
                      });
                      toast.success('Tour booked successfully!');
                      navigate('/dashboard');
                    } catch (error) {
                      toast.error(error?.message || 'Failed to book tour');
                    }
                  }}
                  className="btn-primary w-full py-4 text-base shadow-ambient-md hover:shadow-ambient-lg"
                >
                  Book This Tour
                </button>
                <p className="text-center text-xs text-on-surface-variant mt-4">
                  Free cancellation up to 30 days before departure
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
