import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { destinationsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await destinationsAPI.getAll();
      setDestinations(res.data);
    } catch (err) {
      toast.error('Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      await destinationsAPI.delete(id);
      setDestinations(destinations.filter(d => d._id !== id));
      toast.success('Destination deleted successfully');
    } catch (err) {
      toast.error('Failed to delete destination');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Manage Destinations</h1>
          <p className="text-on-surface-variant">Add, edit, or remove places you offer.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-max">
          <FiPlus /> Add Destination
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-ambient overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                <th className="px-6 py-4 font-semibold w-16">Image</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Country</th>
                <th className="px-6 py-4 font-semibold">Region</th>
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
              ) : destinations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                    No destinations found. Add one to get started.
                  </td>
                </tr>
              ) : (
                destinations.map((dest) => (
                  <tr key={dest._id} className="hover:bg-surface-container-lowest transition-colors text-sm">
                    <td className="px-6 py-4">
                      <img src={dest.image} alt={dest.name} className="w-12 h-12 rounded object-cover" />
                    </td>
                    <td className="px-6 py-4 font-medium text-on-surface">{dest.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{dest.country}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{dest.region}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Edit">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(dest._id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors" title="Delete">
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
