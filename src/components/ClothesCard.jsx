import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS } from '../utils/constants';

const ClothesCard = ({ clothes, onDelete, onSelect, selected }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`card p-4 cursor-pointer transform transition-all duration-200 hover:scale-105 ${
        selected ? 'ring-4 ring-primary-500' : ''
      }`}
      onClick={() => onSelect && onSelect(clothes)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden mb-3">
        <img
          src={clothes.imageUrl}
          alt={clothes.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
          {CATEGORY_LABELS[clothes.category] || clothes.category}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {clothes.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: clothes.color.toLowerCase() }}
              title={clothes.color}
            ></div>
            <span className="text-sm text-gray-600 capitalize">
              {clothes.color}
            </span>
          </div>
        </div>

        {/* Buttons */}
        {onDelete && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit-clothes/${clothes.id}`);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-lg transition-colors"
            >
              Edit
            </button>
            
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(clothes.id);
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothesCard;
