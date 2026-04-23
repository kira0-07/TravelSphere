import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import { hotelsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await hotelsAPI.getAll();
      setHotels(res.data);
    } catch (err) {
      toast.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await hotelsAPI.delete(id);
      setHotels(hotels.filter(h => h._id !== id));
      toast.success('Hotel deleted successfully');
    } catch (err) {
      toast.error('Failed to delete hotel');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Manage Hotels</h1>
          <p className="text-on-surface-variant">Add, edit, or remove partner hotels.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-max">
          <FiPlus /> Add Hotel
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-ambient overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                <th className="px-6 py-4 font-semibold w-16">Image</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Destination</th>
                <th className="px-6 py-4 font-semibold">Stars & Price</th>
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
              ) : hotels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                    No hotels found. Add one to get started.
                  </td>
                </tr>
              ) : (
                hotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-surface-container-lowest transition-colors text-sm">
                    <td className="px-6 py-4">
                      <img src={hotel.image} alt={hotel.name} className="w-12 h-12 rounded object-cover" />
                    </td>
                    <td className="px-6 py-4 font-medium text-on-surface">{hotel.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{hotel.destination}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-amber-500 mb-1">
                        {[...Array(hotel.stars)].map((_, i) => (
                          <FiStar key={i} size={12} className="fill-current" />
                        ))}
                      </div>
                      <span className="font-bold text-primary">${hotel.pricePerNight}</span> <span className="text-xs text-on-surface-variant">/night</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Edit">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(hotel._id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors" title="Delete">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
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
