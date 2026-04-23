import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { bookingsAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Traveler';
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const totalBookings = bookings.length;
  const upcomingTrips = bookings.filter(b => new Date(b.startDate) > new Date() && b.status !== 'cancelled').length;
  const completedTrips = bookings.filter(b => b.status === 'completed').length;
  const totalSpent = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const stats = [
    { icon: FiPackage, label: 'Total Bookings', value: totalBookings.toString(), color: 'text-primary' },
    { icon: FiCalendar, label: 'Upcoming Trips', value: upcomingTrips.toString(), color: 'text-secondary' },
    { icon: FiCheckCircle, label: 'Completed', value: completedTrips.toString(), color: 'text-green-600' },
    { icon: FiDollarSign, label: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, color: 'text-tertiary' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 section-surface pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl p-8 mb-8"
            style={{ background: 'linear-gradient(135deg, #00685f 0%, #008378 100%)' }}
          >
            <p className="text-primary-fixed-dim text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="font-display font-bold text-3xl text-white mb-2">{firstName} 👋</h1>
            <p className="text-white/70 text-sm">Ready to plan your next adventure?</p>
            <Link to="/#packages" className="mt-5 inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-5 py-2.5 rounded-sm hover:bg-white/90 transition-colors">
              Browse Packages →
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card p-5"
              >
                <stat.icon className={`${stat.color} mb-3`} size={22} />
                <p className="font-display font-bold text-xl text-on-surface">{stat.value}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-title-lg text-on-surface">Recent Bookings</h2>
              {bookings.length > 3 && <Link to="/my-trips" className="text-sm text-primary hover:underline">View all</Link>}
            </div>
            
            {loading ? (
              <div className="py-8 text-center text-on-surface-variant text-sm">Loading your adventures...</div>
            ) : bookings.length === 0 ? (
              <div className="py-8 text-center text-on-surface-variant text-sm">No trips booked yet. Time to start exploring!</div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="flex items-center gap-4 p-4 rounded-md bg-surface-container-low border border-outline-variant/10">
                    {booking.image ? (
                      <img src={booking.image} alt={booking.packageTitle} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-surface-container-high flex flex-shrink-0 items-center justify-center">
                        <FiPackage className="text-outline text-xl" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-on-surface truncate">{booking.packageTitle}</p>
                      <p className="text-xs text-on-surface-variant">{booking.destination}</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <StatusBadge status={booking.status} />
                      <p className="text-sm font-bold text-primary">${booking.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
