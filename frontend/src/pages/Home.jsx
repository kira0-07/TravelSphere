import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMail, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import TrustBadges from '../components/TrustBadges';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import TestimonialCard from '../components/TestimonialCard';
import Footer from '../components/Footer';
import GlobeSection from '../components/GlobeSection';
import PackagesFlip from '../components/PackagesFlip';
import HotelsParallax from '../components/HotelsParallax';

// Keeping static testimonials and features since they might not be in DB yet
import { testimonials, features } from '../data/mockData';
import { destinationsAPI, packagesAPI } from '../services/api';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [destRes, pkgRes] = await Promise.all([
          destinationsAPI.getAll(),
          packagesAPI.getFeatured()
        ]);
        setFeaturedDestinations(destRes.data.filter(d => d.featured).slice(0, 6));
        setFeaturedPackages(pkgRes.data);
      } catch (err) {
        console.error('Failed to fetch home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Handle hash scrolling when coming from other pages
  useEffect(() => {
    if (window.location.hash && !loading) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [loading]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center section-surface"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ============================================
          HERO SECTION — Dynamic Adaptive Gradient
      ============================================ */}
      <section
        id="hero"
        className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden hero-dynamic-bg"
      >
        {/* Floating Stickers */}
        <motion.img
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80"
          alt="Paris"
          className="floating-sticker hidden md:block w-48 h-64 top-16 left-[2%] lg:left-[5%] xl:left-[10%] rotate-[-6deg]"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
          alt="Patagonia"
          className="floating-sticker hidden lg:block w-36 h-48 bottom-32 left-[4%] xl:left-[8%] rotate-[8deg]"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.img
          src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80"
          alt="Maldives"
          className="floating-sticker hidden md:block w-40 h-40 bottom-16 left-[20%] xl:left-[25%] rotate-[-12deg]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.img
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80"
          alt="Bali"
          className="floating-sticker hidden xl:block w-56 h-72 top-24 right-[4%] xl:right-[8%] rotate-[8deg]"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.img
          src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80"
          alt="Amalfi Coast"
          className="floating-sticker hidden lg:block w-44 h-56 top-10 right-[25%] xl:right-[30%] rotate-[-4deg]"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
        <motion.img
          src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80"
          alt="Tokyo"
          className="floating-sticker hidden md:block w-40 h-52 bottom-20 right-[5%] xl:right-[15%] rotate-[6deg]"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full mt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-surface-container-high/80 text-on-surface backdrop-blur-sm border border-outline-variant/30 shadow-sm">
              ✈ Trusted by 10,000+ Adventurers Worldwide
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display font-bold text-4xl md:text-6xl lg:text-display-lg text-on-surface mb-5 leading-tight drop-shadow-sm"
            style={{ letterSpacing: '-0.02em' }}
          >
            Discover the World's Most{' '}
            <span className="text-primary">Breathtaking</span>{' '}
            Destinations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-on-surface-variant text-lg md:text-xl mb-10 font-body max-w-xl mx-auto drop-shadow-sm"
          >
            Hand-curated journeys to 500+ destinations. Trusted by 10,000+ travelers.
          </motion.p>

          <SearchBar />
        </div>

        {/* Floating Theme Toggle — bottom-right of hero */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="absolute bottom-8 right-8 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/30 text-on-surface hover:bg-surface-container-lowest transition-all duration-300 shadow-ambient-lg hover:shadow-ambient-xl group"
        >
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ rotate: -60, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <FiSun size={18} className="text-amber-500" /> : <FiMoon size={18} className="text-primary" />}
          </motion.div>
          <span className="text-xs font-medium tracking-wide uppercase">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-on-surface-variant/70 text-xs font-body tracking-widest uppercase">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-on-surface-variant/40 flex items-start justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-on-surface-variant/70 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ============================================
          TRUST BADGES
      ============================================ */}
      <TrustBadges />

      {/* ============================================
          GLOBE & DESTINATIONS
      ============================================ */}
      <GlobeSection />

      {/* ============================================
          SIGNATURE PACKAGES (3D FLIP)
      ============================================ */}
      <PackagesFlip />

      {/* ============================================
          HOTELS PARALLAX
      ============================================ */}
      <HotelsParallax />

      {/* ============================================
          WHY TRAVELSPHERE — 4 Features
      ============================================ */}
      <section id="why-us" className="section-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <p className="text-label-md text-secondary font-medium uppercase tracking-widest mb-2">The TravelSphere Difference</p>
            <h2 className="section-title mx-auto">Why Travel With Us?</h2>
            <div className="section-title-underline mt-2 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-surface-container-lowest rounded-lg p-7 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-5">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-title-md text-on-surface mb-2">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TESTIMONIALS
      ============================================ */}
      <section id="testimonials" className="section-low py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <p className="text-label-md text-secondary font-medium uppercase tracking-widest mb-2">Real Stories</p>
            <h2 className="section-title mx-auto">What Our Travelers Say</h2>
            <div className="section-title-underline mt-2 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          NEWSLETTER CTA
      ============================================ */}
      <section id="newsletter" className="py-20" style={{ background: 'linear-gradient(135deg, #00685f 0%, #008378 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-4xl mb-5">✉️</div>
            <h2 className="font-display font-bold text-headline-md text-white mb-3">
              Get Exclusive Travel Deals
            </h2>
            <p className="text-white/80 mb-8 font-body">
              Subscribe to our newsletter and receive curated travel inspirations, flash deals, and insider tips directly in your inbox.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-3 bg-white/20 text-white px-6 py-4 rounded-lg"
              >
                <span className="text-xl">🎉</span>
                <span className="font-semibold">You're subscribed! Watch your inbox.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                  <input
                    type="email"
                    id="newsletter-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-white/20 text-white placeholder-white/50 rounded-lg outline-none focus:bg-white/30 transition-colors font-body text-sm"
                  />
                </div>
                <button type="submit" id="subscribe-btn" className="px-6 py-4 bg-white text-primary font-display font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm whitespace-nowrap">
                  Subscribe Free
                </button>
              </form>
            )}

            <p className="text-white/50 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
