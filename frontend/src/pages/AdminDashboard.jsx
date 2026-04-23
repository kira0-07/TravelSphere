import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUsers, FiPackage, FiMapPin, FiDollarSign, FiClock, FiActivity, FiDatabase, FiHome, FiCheck } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, statusRes, bookingsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getSystemStatus(),
        adminAPI.getRecentBookings()
      ]);
      setStats(statsRes.data);
      setSystemStatus(statusRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status} successfully`);
      fetchAdminData(); // Refresh data
    } catch (err) {
      console.error('Failed to update booking', err);
      toast.error('Failed to update booking status');
    }
  };

  const statCards = [
    { icon: FiDollarSign, label: 'Total Revenue', value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '0', color: 'text-primary' },
    { icon: FiUsers, label: 'Total Users', value: stats?.totalUsers.toString() || '0', color: 'text-secondary' },
    { icon: FiClock, label: 'Total Bookings', value: stats?.totalBookings.toString() || '0', color: 'text-tertiary' },
  ];

  const managementCards = [
    { icon: FiPackage, label: 'Manage Packages', desc: `${stats?.totalPackages || 0} Total`, link: '/admin/packages', bg: 'bg-primary/10', color: 'text-primary' },
    { icon: FiMapPin, label: 'Manage Destinations', desc: `${stats?.totalDestinations || 0} Total`, link: '/admin/destinations', bg: 'bg-secondary/10', color: 'text-secondary' },
    { icon: FiHome, label: 'Manage Hotels', desc: `${stats?.totalHotels || 0} Total`, link: '/admin/hotels', bg: 'bg-tertiary/10', color: 'text-tertiary' },
    { icon: FiClock, label: 'Manage Bookings', desc: `${stats?.totalBookings || 0} Total`, link: '/admin/bookings', bg: 'bg-surface-variant', color: 'text-on-surface' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Admin Overview</h1>
        <p className="text-on-surface-variant">System status and booking management.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-ambient flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                  <FiActivity size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant">Website Status</p>
                  <p className="font-display font-bold text-xl text-on-surface capitalize">{systemStatus?.website || 'Checking...'}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${systemStatus?.website === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-ambient flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary/10 text-secondary">
                  <FiDatabase size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant">Database (MongoDB)</p>
                  <p className="font-display font-bold text-xl text-on-surface capitalize">{systemStatus?.database || 'Checking...'}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${systemStatus?.database === 'connected' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
            </motion.div>
          </div>

          {/* Manage Bookings Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl text-on-surface">Manage Bookings</h2>
              <Link to="/admin/bookings" className="text-sm text-primary hover:underline font-medium">View all</Link>
            </div>
            
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-ambient overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Package</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      bookings.slice(0, 8).map((booking) => (
                        <tr key={booking._id} className="hover:bg-surface-container-lowest transition-colors text-sm">
                          <td className="px-6 py-4">
                            <p className="font-medium text-on-surface">{booking.userId?.name || 'Unknown'}</p>
                            <p className="text-xs text-on-surface-variant">{booking.userId?.email || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-on-surface truncate max-w-[200px]">{booking.packageTitle}</p>
                            <p className="text-xs text-on-surface-variant">{new Date(booking.startDate).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4 font-bold text-primary">
                            ${booking.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            {booking.status === 'pending' ? (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded hover:bg-primary-dark transition-colors"
                              >
                                <FiCheck /> Confirm
                              </button>
                            ) : (
                              <span className="text-xs text-on-surface-variant italic">No actions</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
