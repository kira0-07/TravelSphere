import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiCornerDownLeft } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { destinationsAPI } from '../services/api';

export default function SearchBar({ compact = false }) {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationsAPI.getAll();
        setDestinations(res.data);
      } catch (err) {
        console.error('Failed to fetch destinations', err);
      }
    };
    fetchDestinations();
  }, []);
  const [destination, setDestination] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDest, setSelectedDest] = useState(null); // holds the matched destination object
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [startDate, setStartDate] = useState(() => {
    const stored = localStorage.getItem('search_startDate');
    return stored ? new Date(stored) : null;
  });
  const [endDate, setEndDate] = useState(() => {
    const stored = localStorage.getItem('search_endDate');
    return stored ? new Date(stored) : null;
  });
  const [travelers, setTravelers] = useState(() => {
    const stored = localStorage.getItem('travelers');
    return stored ? parseInt(stored) : 2;
  });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const filteredDestinations = destination.trim()
    ? destinations.filter(d => {
        const q = destination.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          d.tags?.some(t => t.toLowerCase().includes(q))
        );
      })
    : [];

  // Reset highlight when filtered results change
  useEffect(() => {
    setHighlightIndex(-1);
  }, [destination]);

  const handleSelectDestination = (dest) => {
    setDestination(`${dest.name}, ${dest.country}`);
    setSelectedDest(dest);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredDestinations.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => (prev < filteredDestinations.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => (prev > 0 ? prev - 1 : filteredDestinations.length - 1));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelectDestination(filteredDestinations[highlightIndex]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // If a specific destination was selected from autocomplete, go directly to its detail page
    if (selectedDest) {
      navigate(`/destinations/${selectedDest.id}`);
      return;
    }

    // Otherwise do a free-text search on the packages page
    const params = new URLSearchParams();
    if (destination) params.set('q', destination);
    if (startDate) params.set('startDate', startDate.toISOString());
    if (endDate) params.set('endDate', endDate.toISOString());
    if (travelers) params.set('travelers', travelers);
    navigate(`/packages?${params.toString()}`);
  };

  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    
    if (start) localStorage.setItem('search_startDate', start.toISOString());
    else localStorage.removeItem('search_startDate');
    
    if (end) localStorage.setItem('search_endDate', end.toISOString());
    else localStorage.removeItem('search_endDate');
  };

  // When user changes text after selecting, clear the selected dest
  const handleInputChange = (e) => {
    const val = e.target.value;
    setDestination(val);
    setShowSuggestions(true);
    if (selectedDest && val !== `${selectedDest.name}, ${selectedDest.country}`) {
      setSelectedDest(null);
    }
  };

  /* ─── Autocomplete Dropdown (shared between compact and full) ─── */
  const renderDropdown = () => (
    <AnimatePresence>
      {showSuggestions && destination.trim() && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 mt-1.5 w-full bg-surface-container-lowest rounded-xl shadow-ambient-lg border border-outline-variant/20 z-50 max-h-72 overflow-y-auto"
        >
          {filteredDestinations.length > 0 ? (
            <>
              {filteredDestinations.map((dest, i) => (
                <div
                  key={dest.id}
                  onClick={() => handleSelectDestination(dest)}
                  className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors border-b border-outline-variant/10 last:border-0
                    ${i === highlightIndex ? 'bg-primary/10' : 'hover:bg-surface-container-low'}`}
                >
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-primary" size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{dest.name}</p>
                    <p className="text-xs text-on-surface-variant">{dest.country} · {dest.region}</p>
                  </div>
                  {dest.rating && (
                    <span className="text-xs font-medium text-secondary flex-shrink-0">★ {dest.rating}</span>
                  )}
                </div>
              ))}
              <div className="px-4 py-2 text-xs text-on-surface-variant flex items-center gap-1.5 bg-surface-container-low/50">
                <FiCornerDownLeft size={12} /> <span>Select to go to destination · or press Search</span>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-on-surface-variant">No destinations found for "<span className="font-medium text-on-surface">{destination}</span>"</p>
              <p className="text-xs text-on-surface-variant mt-1">Try searching a city, country, or tag like "Beach"</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ─── Compact mode ─── */
  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2 w-full">
        <div className="flex-1 w-full relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant z-10" size={16} />
          <input
            type="text"
            value={destination}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Where to?"
            className="input-field pl-9 w-full"
            autoComplete="off"
          />
          {renderDropdown()}
        </div>
        <button type="submit" className="btn-primary py-3 px-5 text-sm w-full md:w-auto whitespace-nowrap">Search</button>
      </form>
    );
  }

  /* ─── Full hero mode ─── */
  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-surface-container-lowest rounded-2xl p-2 md:p-3 shadow-ambient-xl w-full max-w-4xl mx-auto border border-outline-variant/10"
    >
      <div className="flex flex-col md:flex-row gap-2 items-center">

        {/* Destination with autocomplete */}
        <div className="flex-1 relative w-full">
          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10" size={18} />
          <input
            type="text"
            id="search-destination"
            value={destination}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Where are you going?"
            className="w-full pl-11 pr-4 py-4 bg-transparent text-on-surface placeholder-on-surface/50 text-sm font-body outline-none focus:bg-surface-container-low transition-colors rounded-t-md md:rounded-l-md md:rounded-tr-none"
            autoComplete="off"
          />
          {renderDropdown()}
        </div>

        <div className="flex-1 relative w-full">
          <FiCalendar className="absolute left-4 top-[22px] -translate-y-1/2 text-primary z-10" size={18} />
          <DatePicker
            selected={startDate}
            onChange={onChangeDate}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            minDate={new Date()}
            monthsShown={2}
            placeholderText="Check-in - Check-out"
            className="w-full pl-11 pr-4 py-4 bg-transparent text-on-surface placeholder-on-surface/50 text-sm font-body outline-none focus:bg-surface-container-low transition-colors"
            wrapperClassName="w-full"
          />
        </div>

        {/* Travelers */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 w-full md:w-auto md:min-w-[140px]">
          <div className="flex items-center gap-2">
            <FiUsers className="text-primary flex-shrink-0" size={18} />
            <span className="text-sm font-medium text-on-surface-variant md:hidden">Travelers</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => {
                const newVal = Math.max(1, travelers - 1);
                setTravelers(newVal);
                localStorage.setItem('travelers', newVal);
              }} 
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center text-lg font-light transition-colors"
            >−</button>
            <span className="text-sm font-semibold text-on-surface min-w-[20px] text-center">{travelers}</span>
            <button 
              type="button" 
              onClick={() => {
                const newVal = Math.min(20, travelers + 1);
                setTravelers(newVal);
                localStorage.setItem('travelers', newVal);
              }} 
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center text-lg font-light transition-colors"
            >+</button>
          </div>
        </div>

        {/* Search Button */}
        <button type="submit" id="search-btn" className="btn-primary rounded-lg px-8 py-4 text-sm w-full md:w-auto mt-2 md:mt-0">
          <FiSearch size={18} />
          <span className="md:hidden lg:inline ml-2">Search</span>
        </button>
      </div>
    </motion.form>
  );
}
