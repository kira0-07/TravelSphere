import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiCalendar, FiUsers } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PackageCard from '../components/PackageCard';
import { packagesAPI } from '../services/api';
import { packages as mockPackages } from '../data/mockData';

export default function Packages() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await packagesAPI.getAll({ q: query });
        if (res.data && res.data.length > 0) {
          setPackages(res.data);
        } else {
          // Filter mock data locally if query exists
          const filtered = query 
            ? mockPackages.filter(p => 
                p.title.toLowerCase().includes(query.toLowerCase()) || 
                p.destination.toLowerCase().includes(query.toLowerCase()))
            : mockPackages;
          setPackages(filtered);
        }
      } catch (err) {
        console.error('Failed to fetch packages, using mock fallback', err);
        const filtered = query 
          ? mockPackages.filter(p => 
              p.title.toLowerCase().includes(query.toLowerCase()) || 
              p.destination.toLowerCase().includes(query.toLowerCase()))
          : mockPackages;
        setPackages(filtered);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [query]);

  const filteredPackages = filter === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.difficulty.toLowerCase() === filter.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-display font-bold text-on-surface mb-2">
                {query ? `Search Results for "${query}"` : 'Explore All Packages'}
              </h1>
              <p className="text-on-surface-variant">
                Discover your next adventure from our curated list of tours.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-surface-container rounded-lg px-3 py-2 border border-outline-variant/30">
                <FiFilter className="text-primary" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent text-sm font-medium text-on-surface outline-none"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[400px] rounded-2xl bg-surface-container-low animate-pulse" />
              ))}
            </div>
          ) : filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant">
              <div className="text-6xl mb-6">🏝️</div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-2">No Packages Found</h3>
              <p className="text-on-surface-variant max-w-md mx-auto">
                We couldn't find any packages matching your criteria. Try adjusting your search or filters.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-primary mt-8 px-8"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
