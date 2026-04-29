import { useState, useEffect } from 'react';
import { packagesAPI, destinationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function PackageForm({ pkg, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    destinationId: '',
    destination: '',
    image: '',
    duration: 7,
    price: 0,
    originalPrice: 0,
    difficulty: 'Easy',
    badge: '',
    tags: '',
    includes: '',
    excludes: '',
    featured: false,
    minGroupSize: 1,
    maxGroupSize: 10,
    rating: 5,
    reviewCount: 0,
  });
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDestinations();
    if (pkg) {
      setFormData({
        ...pkg,
        tags: pkg.tags ? pkg.tags.join(', ') : '',
        includes: pkg.includes ? pkg.includes.join(', ') : '',
        excludes: pkg.excludes ? pkg.excludes.join(', ') : '',
        minGroupSize: pkg.groupSize?.min || 1,
        maxGroupSize: pkg.groupSize?.max || 10,
      });
    }
  }, [pkg]);

  const fetchDestinations = async () => {
    try {
      const res = await destinationsAPI.getAll();
      setDestinations(res.data);
    } catch (err) {
      toast.error('Failed to fetch destinations');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'destinationId') {
      const selectedDest = destinations.find(d => d.id === value);
      setFormData(prev => ({
        ...prev,
        destinationId: value,
        destination: selectedDest ? `${selectedDest.name}, ${selectedDest.country}` : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        duration: Number(formData.duration),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        groupSize: {
          min: Number(formData.minGroupSize),
          max: Number(formData.maxGroupSize)
        },
        tags: formData.tags.split(',').map(s => s.trim()).filter(s => s !== ''),
        includes: formData.includes.split(',').map(s => s.trim()).filter(s => s !== ''),
        excludes: formData.excludes.split(',').map(s => s.trim()).filter(s => s !== ''),
        rating: Number(formData.rating),
        reviewCount: Number(formData.reviewCount),
      };

      if (pkg) {
        await packagesAPI.update(pkg._id, dataToSubmit);
        toast.success('Package updated successfully');
      } else {
        await packagesAPI.create(dataToSubmit);
        toast.success('Package created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Custom ID (e.g. pkg-010)</label>
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
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Package Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Destination</label>
          <select
            name="destinationId"
            value={formData.destinationId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select a destination</option>
            {destinations.map(dest => (
              <option key={dest._id} value={dest.id}>{dest.name}, {dest.country}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Duration (days)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Orig. Price ($)</label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Min Group Size</label>
          <input
            type="number"
            name="minGroupSize"
            value={formData.minGroupSize}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Max Group Size</label>
          <input
            type="number"
            name="maxGroupSize"
            value={formData.maxGroupSize}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
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
        <label className="block text-sm font-medium text-on-surface-variant mb-1">Image URL</label>
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
        <label className="block text-sm font-medium text-on-surface-variant mb-1">Includes (comma separated)</label>
        <textarea
          name="includes"
          value={formData.includes}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Flights, Hotels, Breakfast..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-on-surface-variant mb-1">Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Beach, Adventure, Culture..."
        />
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
        <label htmlFor="featured" className="text-sm font-medium text-on-surface-variant">Featured Package</label>
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
          {loading ? 'Saving...' : pkg ? 'Update Package' : 'Create Package'}
        </button>
      </div>
    </form>
  );
}
