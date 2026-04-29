import { useState, useEffect } from 'react';
import { destinationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function DestinationForm({ destination, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    country: '',
    region: 'Europe',
    image: '',
    heroImage: '',
    description: '',
    climate: '',
    tags: '',
    bestMonths: '',
    highlights: '',
    featured: false,
    rating: 5,
    reviewCount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (destination) {
      setFormData({
        ...destination,
        tags: destination.tags ? destination.tags.join(', ') : '',
        bestMonths: destination.bestMonths ? destination.bestMonths.join(', ') : '',
        highlights: destination.highlights ? destination.highlights.join(', ') : '',
      });
    }
  }, [destination]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        tags: formData.tags.split(',').map(s => s.trim()).filter(s => s !== ''),
        bestMonths: formData.bestMonths.split(',').map(s => s.trim()).filter(s => s !== ''),
        highlights: formData.highlights.split(',').map(s => s.trim()).filter(s => s !== ''),
        rating: Number(formData.rating),
        reviewCount: Number(formData.reviewCount),
      };

      if (destination) {
        await destinationsAPI.update(destination._id, dataToSubmit);
        toast.success('Destination updated successfully');
      } else {
        await destinationsAPI.create(dataToSubmit);
        toast.success('Destination created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to save destination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Custom ID (e.g. bali)</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Americas">Americas</option>
            <option value="Africa">Africa</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-on-surface-variant mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Card Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Hero Image URL</label>
          <input
            type="url"
            name="heroImage"
            value={formData.heroImage}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Climate</label>
          <input
            type="text"
            name="climate"
            value={formData.climate}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Tropical, Mediterranean..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Best Months (comma separated)</label>
          <input
            type="text"
            name="bestMonths"
            value={formData.bestMonths}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="May, Jun, Jul..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Rating (1-5)</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="5"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Review Count</label>
          <input
            type="number"
            name="reviewCount"
            value={formData.reviewCount}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-on-surface-variant mb-1">Highlights (comma separated)</label>
        <textarea
          name="highlights"
          value={formData.highlights}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Eiffel Tower, Louvre Museum..."
        ></textarea>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="w-4 h-4 text-primary focus:ring-primary border-outline-variant/30 rounded"
        />
        <label htmlFor="featured" className="text-sm font-medium text-on-surface-variant">Featured Destination</label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8"
        >
          {loading ? 'Saving...' : destination ? 'Update Destination' : 'Create Destination'}
        </button>
      </div>
    </form>
  );
}
