import { useState, useEffect } from 'react';
import { hotelsAPI, destinationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function HotelForm({ hotel, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    destinationId: '',
    destination: '',
    image: '',
    stars: 5,
    pricePerNight: 0,
    type: '',
    featured: false,
    amenities: '',
    rating: 5,
    reviewCount: 0,
  });
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDestinations();
    if (hotel) {
      setFormData({
        ...hotel,
        amenities: hotel.amenities ? hotel.amenities.join(', ') : '',
      });
    }
  }, [hotel]);

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
        stars: Number(formData.stars),
        pricePerNight: Number(formData.pricePerNight),
        amenities: formData.amenities.split(',').map(s => s.trim()).filter(s => s !== ''),
        rating: Number(formData.rating),
        reviewCount: Number(formData.reviewCount),
      };

      if (hotel) {
        await hotelsAPI.update(hotel._id, dataToSubmit);
        toast.success('Hotel updated successfully');
      } else {
        await hotelsAPI.create(dataToSubmit);
        toast.success('Hotel created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to save hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Custom ID (e.g. htl-006)</label>
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
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Hotel Name</label>
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
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Hotel Type (e.g. Resort, Boutique)</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Stars (1-5)</label>
          <input
            type="number"
            name="stars"
            min="1"
            max="5"
            value={formData.stars}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Price Per Night ($)</label>
          <input
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleChange}
            required
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
        <label className="block text-sm font-medium text-on-surface-variant mb-1">Amenities (comma separated)</label>
        <textarea
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2 bg-surface-variant/20 border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="WiFi, Pool, Spa..."
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
        <label htmlFor="featured" className="text-sm font-medium text-on-surface-variant">Featured Hotel</label>
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
          {loading ? 'Saving...' : hotel ? 'Update Hotel' : 'Create Hotel'}
        </button>
      </div>
    </form>
  );
}
