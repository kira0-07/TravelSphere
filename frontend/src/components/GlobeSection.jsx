import { useState, useRef, useEffect, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { destinations } from '../data/mockData';
import { FiArrowRight, FiMapPin, FiX, FiNavigation } from 'react-icons/fi';

// Helper to calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function GlobeSection() {
  const globeRef = useRef();
  const navigate = useNavigate();
  const [selectedD, setSelectedD] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [userLocation, setUserLocation] = useState(null);
  const containerRef = useRef(null);

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: 'Your Location',
          isUser: true
        });
      }, (error) => {
        console.warn("Geolocation error:", error);
      }, { timeout: 10000 });
    }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    // Auto-rotate setup
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ altitude: 2 });
    }
  }, []);

  const handleDestinationSelect = useCallback((destination) => {
    if (!globeRef.current) return;
    
    if (destination && selectedD?.id !== destination.id) {
      // Ensure the globe is fully visible
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      globeRef.current.controls().autoRotate = false;
      globeRef.current.pointOfView({
        lat: destination.lat,
        lng: destination.lng,
        altitude: 1.2
      }, 1000); // 1000ms transition
      setSelectedD(destination);
    } else {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.pointOfView({ altitude: 2 }, 1000);
      setSelectedD(null);
    }
  }, [selectedD]);

  const allLabels = userLocation ? [...destinations, userLocation] : destinations;

  const arcsData = selectedD && userLocation ? [{
    startLat: userLocation.lat,
    startLng: userLocation.lng,
    endLat: selectedD.lat,
    endLng: selectedD.lng,
    color: '#00F0FF'
  }] : [];

  let flightTimeStr = '';
  if (selectedD && userLocation) {
    const distKm = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, selectedD.lat, selectedD.lng);
    const flightHours = distKm / 800; // rough estimate 800 km/h
    flightTimeStr = flightHours < 1 ? '< 1 hr flight' : `~${Math.round(flightHours)} hr flight`;
  }

  return (
    <section id="globe-destinations" className="relative w-full min-h-screen lg:h-screen bg-surface overflow-hidden flex flex-col pt-20 pb-8">
      {/* Background Gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.05) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full mb-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-secondary font-medium tracking-[0.1em] uppercase text-sm mb-4"
        >
          The Digital Concierge
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-5xl lg:text-7xl text-on-surface leading-tight tracking-tight"
        >
          Explore The <span className="text-primary">Globe</span>
        </motion.h2>
      </div>

      {/* Interactive 3D Globe Area */}
      <div className="flex-1 relative w-full flex flex-col lg:flex-row items-center justify-center gap-8 px-4 sm:px-8 z-20">
        
        {/* Globe Container */}
        <div 
          ref={containerRef} 
          className="w-full lg:w-1/2 h-[400px] lg:h-full max-h-[600px] relative rounded-3xl overflow-hidden border border-outline-variant/30 bg-surface-container shadow-lg"
        >
          {dimensions.width > 0 && (
            <Globe
              ref={globeRef}
              width={dimensions.width}
              height={dimensions.height}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              labelsData={allLabels}
              labelLat={d => d.lat}
              labelLng={d => d.lng}
              labelText={d => d.name}
              labelSize={d => d.isUser ? 1.5 : (selectedD ? 1.5 : 3.0)}
              labelDotRadius={d => d.isUser ? 0.5 : (selectedD ? 0.5 : 1.0)}
              labelColor={d => d.isUser ? '#FFFFFF' : (d === selectedD ? '#00F0FF' : '#D4AF37')}
              labelResolution={2}
              onLabelClick={(d) => !d.isUser && handleDestinationSelect(d)}
              atmosphereColor="#00F0FF"
              atmosphereAltitude={0.15}
              arcsData={arcsData}
              arcStartLat={d => d.startLat}
              arcStartLng={d => d.startLng}
              arcEndLat={d => d.endLat}
              arcEndLng={d => d.endLng}
              arcColor={d => d.color}
              arcDashLength={0.4}
              arcDashGap={4}
              arcDashInitialGap={() => Math.random()}
              arcDashAnimateTime={4000}
              arcAltitudeAutoScale={0.2}
            />
          )}
          
          {/* Selected Destination Overlay */}
          <AnimatePresence>
            {selectedD && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-surface-container-highest/90 backdrop-blur-xl border border-outline-variant/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl pr-12"
              >
                {/* Close Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDestinationSelect(null);
                  }}
                  className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
                >
                  <FiX size={18} />
                </button>

                <div>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <FiMapPin />
                    <span className="text-xs uppercase tracking-widest font-semibold">{selectedD.country}</span>
                  </div>
                  <h3 className="text-2xl font-display text-on-surface mb-2">{selectedD.name}</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 max-w-md mb-3">{selectedD.description}</p>
                  
                  {flightTimeStr && (
                    <div className="flex items-center gap-2 text-primary text-sm font-medium bg-primary/10 w-fit px-3 py-1.5 rounded-md border border-primary/20">
                      <FiNavigation className="shrink-0" />
                      <span>{flightTimeStr} from your location</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => navigate(`/destinations/${selectedD.id}`)}
                  className="btn-primary shrink-0 w-full md:w-auto mt-2 md:mt-0"
                >
                  Explore Booking
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scrolling Destinations List */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-full max-h-[600px] overflow-y-auto no-scrollbar scroll-smooth pr-2 pb-12">
          <div className="flex flex-col gap-6">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleDestinationSelect(dest)}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer border ${
                  selectedD?.id === dest.id 
                    ? 'border-primary bg-surface-container shadow-md' 
                    : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center p-4 gap-6">
                  {/* Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="text-xl font-display text-on-surface group-hover:text-primary transition-colors">
                      {dest.name}
                    </h4>
                    <p className="text-on-surface-variant text-sm mt-1">{dest.country}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-surface-container-high text-on-surface">
                        ⭐ {dest.rating}
                      </span>
                      {dest.featured && (
                        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                          Trending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className={`p-3 rounded-full transition-all duration-300 ${
                    selectedD?.id === dest.id ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'
                  }`}>
                    <FiArrowRight />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
