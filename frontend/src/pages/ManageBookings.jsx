import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // We use the existing getRecentBookings endpoint which returns bookings for the admin
      const res = await adminAPI.getRecentBookings();
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status} successfully`);
      fetchBookings(); // Refresh data
    } catch (err) {
      console.error('Failed to update booking', err);
      toast.error('Failed to update booking status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Manage Bookings</h1>
        <p className="text-on-surface-variant">Review and confirm customer travel bookings.</p>
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
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
  );
}
