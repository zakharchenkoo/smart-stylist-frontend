import React from 'react';
import { EVENT_TYPES } from '../utils/constants';

const EventCard = ({ event, onDelete, onView }) => {
  const eventType = EVENT_TYPES.find(type => type.value === event.eventType);
  const eventDate = new Date(event.eventDate);
  
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
          <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
            {eventType ? eventType.emoji : '📅'} {eventType ? eventType.label : event.eventType}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center space-x-2 mb-4 text-gray-600">
        <span className="text-2xl">📅</span>
        <span className="font-medium">
          {eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      )}

      {/* Outfit Info */}
      {event.outfit && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-600">Outfit:</p>
          <p className="font-semibold text-gray-800">{event.outfit.name}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex space-x-2">
        {onView && (
          <button
            onClick={() => onView(event)}
            className="flex-1 btn-primary"
          >
            👁️ View
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(event.id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition font-medium"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;