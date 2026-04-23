import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import { bookingsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function MyTrips() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingsAPI.getMyBookings();
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return new Date(b.startDate) > new Date() && b.status !== 'cancelled';
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingsAPI.cancel(id);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Tour cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 section-surface pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6 text-sm font-medium transition-colors">
            <FiArrowLeft /> Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-on-surface mb-2">My Trips</h1>
              <p className="text-on-surface-variant">View and manage all your past and upcoming adventures.</p>
            </div>
            
            <div className="flex bg-surface-container-low p-1 rounded-lg">
              {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-white shadow-ambient' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-surface-container-low rounded-xl p-12 text-center border border-outline-variant/10">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-on-surface-variant">
                ✈️
              </div>
              <h3 className="font-display font-semibold text-title-lg text-on-surface mb-2">No trips found</h3>
              <p className="text-on-surface-variant mb-6">You don't have any {filter !== 'all' ? filter : ''} trips right now.</p>
              <Link to="/#packages" className="btn-primary">Browse Packages</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient border border-outline-variant/20 flex flex-col md:flex-row gap-6 md:items-center"
                >
                  {booking.image ? (
                    <img src={booking.image} alt={booking.packageTitle} className="w-full md:w-48 h-32 md:h-full object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-full md:w-48 h-32 md:h-full bg-surface-container-high rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiPackage className="text-outline text-3xl" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={booking.status} />
                      <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{booking.destination}</span>
                    </div>
                    <h3 className="font-display font-bold text-title-lg text-on-surface mb-2">{booking.packageTitle}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-surface-variant">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar className="text-primary-fixed-dim" />
                        {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                      <span>Traverlers: {booking.travelers || 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/10">
                    <div className="text-left md:text-right mb-0 md:mb-4">
                      <p className="text-xs text-on-surface-variant">Total Amount</p>
                      <p className="font-display font-bold text-xl text-primary">${booking.totalAmount.toLocaleString()}</p>
                    </div>
                    {booking.status === 'pending' || booking.status === 'confirmed' ? (
                      <button onClick={() => handleCancel(booking._id)} className="text-error text-sm font-medium hover:underline">Cancel Booking</button>
                    ) : (
                      <button onClick={() => navigate(`/packages/${booking.packageId}`)} className="text-primary text-sm font-medium hover:underline">Book Again</button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
