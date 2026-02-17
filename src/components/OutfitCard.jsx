import React from 'react';

const OutfitCard = ({ outfit, onDelete, onView }) => {
  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{outfit.name}</h3>
      
      {/* Clothes Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {outfit.clothes && outfit.clothes.slice(0, 4).map((item) => (
          <div key={item.id} className="relative">
            <img
              src={item.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
              alt={item.name}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        ))}
        {outfit.clothes && outfit.clothes.length > 4 && (
          <div className="flex items-center justify-center bg-gray-200 rounded-lg h-32">
            <span className="text-2xl font-bold text-gray-600">
              +{outfit.clothes.length - 4}
            </span>
          </div>
        )}
      </div>

      {/* Items Count */}
      <p className="text-sm text-gray-600 mb-4">
        {outfit.clothes ? outfit.clothes.length : 0} items
      </p>

      {/* Buttons */}
      <div className="flex space-x-2">
        {onView && (
          <button
            onClick={() => onView(outfit)}
            className="flex-1 btn-primary"
          >
            👁️ View
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(outfit.id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition font-medium"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default OutfitCard;