import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clothesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload'; 
import { CATEGORIES, COLORS, CATEGORY_LABELS } from '../utils/constants';

const AddClothes = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'TSHIRTS_TOPS',
    color: 'Black',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (url) => {
    setFormData({
      ...formData,
      imageUrl: url
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      await clothesAPI.addClothes({
        name: formData.name,
        category: formData.category, 
        color: formData.color,
        imageUrl: formData.imageUrl,
        userId: user.id
      });
      
      navigate('/wardrobe');
    } catch (err) {
      setError('Failed to add clothes. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">➕ Add New Clothes</h1>
            <p className="text-gray-600">Add a new item to your wardrobe</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Blue Jeans, White T-Shirt"
                  className="input-field"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {Object.keys(CATEGORIES).map((key) => (
                    <option key={key} value={CATEGORIES[key]}>
                      {CATEGORY_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Color *
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {COLORS.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: formData.color.toLowerCase() }}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Image *
                </label>
                <ImageUpload 
                  onImageUpload={handleImageUpload}
                  currentImageUrl={formData.imageUrl}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/wardrobe')}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.imageUrl}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClothes;