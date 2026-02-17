import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { outfitAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import OutfitCard from '../components/OutfitCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Outfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      const response = await outfitAPI.getAllOutfits(user.id);
      setOutfits(response.data);
    } catch (err) {
      setError('Failed to load outfits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this outfit?')) {
      try {
        await outfitAPI.deleteOutfit(id);
        fetchOutfits();
      } catch (err) {
        alert('Failed to delete outfit');
      }
    }
  };

  const handleView = (outfit) => {
    // Navigate to outfit details or show modal
    alert(`Viewing outfit: ${outfit.name}\n${outfit.clothes.length} items`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">👗 My Outfits</h1>
            <p className="text-gray-600">{outfits.length} outfits</p>
          </div>
          <button
            onClick={() => navigate('/create-outfit')}
            className="btn-primary"
          >
            ➕ Create Outfit
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Outfits Grid */}
        {outfits.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">👗</p>
            <p className="text-xl text-gray-600 mb-4">No outfits yet</p>
            <p className="text-gray-500 mb-6">Create your first outfit or get AI recommendations</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/create-outfit')}
                className="btn-primary"
              >
                Create Outfit
              </button>
              <button
                onClick={() => navigate('/ai-recommendations')}
                className="btn-secondary"
              >
                🤖 Get AI Suggestions
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {outfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Outfits;