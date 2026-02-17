import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clothesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ClothesCard from '../components/ClothesCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { CATEGORIES } from '../utils/constants';

const Wardrobe = () => {
  const [clothes, setClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClothes();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredClothes(clothes);
    } else {
      setFilteredClothes(clothes.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, clothes]);

  const fetchClothes = async () => {
    try {
      setLoading(true);
      const response = await clothesAPI.getAllClothes(user.id);
      setClothes(response.data);
      setFilteredClothes(response.data);
    } catch (err) {
      setError('Failed to load wardrobe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await clothesAPI.deleteClothes(id);
        fetchClothes();
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">👕 My Wardrobe</h1>
            <p className="text-gray-600">{filteredClothes.length} items</p>
          </div>
          <button
            onClick={() => navigate('/add-clothes')}
            className="btn-primary"
          >
            ➕ Add Clothes
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {Object.values(CATEGORIES).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Clothes Grid */}
        {filteredClothes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">👔</p>
            <p className="text-xl text-gray-600 mb-4">Your wardrobe is empty</p>
            <button
              onClick={() => navigate('/add-clothes')}
              className="btn-primary"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClothes.map((item) => (
              <ClothesCard
                key={item.id}
                clothes={item}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wardrobe;