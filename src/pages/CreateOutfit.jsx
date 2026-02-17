import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clothesAPI, outfitAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ClothesCard from '../components/ClothesCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateOutfit = () => {
  const [outfitName, setOutfitName] = useState('');
  const [allClothes, setAllClothes] = useState([]);
  const [selectedClothes, setSelectedClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClothes();
  }, []);

  const fetchClothes = async () => {
    try {
      setLoading(true);
      const response = await clothesAPI.getAllClothes(user.id);
      setAllClothes(response.data);
    } catch (err) {
      setError('Failed to load clothes');
    } finally {
      setLoading(false);
    }
  };

  const toggleClothesSelection = (clothesId) => {
    if (selectedClothes.includes(clothesId)) {
      setSelectedClothes(selectedClothes.filter(id => id !== clothesId));
    } else {
      setSelectedClothes([...selectedClothes, clothesId]);
    }
  };

  const handleCreateOutfit = async () => {
    if (!outfitName.trim()) {
      alert('Please enter an outfit name');
      return;
    }

    if (selectedClothes.length === 0) {
      alert('Please select at least one clothing item');
      return;
    }

    try {
      setLoading(true);
      await outfitAPI.createOutfit({
        name: outfitName,
        userId: user.id,
        clothesIds: selectedClothes
      });
      navigate('/outfits');
    } catch (err) {
      alert('Failed to create outfit');
    } finally {
      setLoading(false);
    }
  };

  if (loading && allClothes.length === 0) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">✨ Create New Outfit</h1>
          <p className="text-gray-600">Select clothes to create your outfit</p>
        </div>

        {/* Outfit Name Input */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <label className="block text-gray-700 font-medium mb-2">
            Outfit Name *
          </label>
          <input
            type="text"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            placeholder="e.g., Summer Casual, Office Look"
            className="input-field"
          />
        </div>

        {/* Selected Count */}
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <p className="text-primary-800 font-medium">
            Selected: {selectedClothes.length} {selectedClothes.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Clothes Grid */}
        {allClothes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">👔</p>
            <p className="text-xl text-gray-600 mb-4">No clothes in wardrobe</p>
            <p className="text-gray-500 mb-6">Add some clothes first before creating outfits</p>
            <button
              onClick={() => navigate('/add-clothes')}
              className="btn-primary"
            >
              Add Clothes
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {allClothes.map((item) => (
                <ClothesCard
                  key={item.id}
                  clothes={item}
                  isSelected={selectedClothes.includes(item.id)}
                  onSelect={() => toggleClothesSelection(item.id)}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-white shadow-2xl rounded-full p-4">
              <button
                onClick={() => navigate('/outfits')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOutfit}
                disabled={loading || selectedClothes.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : `Create Outfit (${selectedClothes.length})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateOutfit;