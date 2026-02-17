import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI, outfitAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { EVENT_TYPES } from '../utils/constants';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customEventType, setCustomEventType] = useState(''); 
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    eventType: 'CASUAL',
    eventDate: '',
    description: '',
    outfitId: ''
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, outfitsRes] = await Promise.all([
        eventAPI.getAllEvents(user.id),
        outfitAPI.getAllOutfits(user.id)
      ]);
      setEvents(eventsRes.data);
      setOutfits(outfitsRes.data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventAPI.createEvent({
        ...formData,
        userId: user.id,
        outfitId: formData.outfitId || null
      });
      setShowModal(false);
      setFormData({
        name: '',
        eventType: 'CASUAL',
        eventDate: '',
        description: '',
        outfitId: ''
      });
      fetchData();
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.deleteEvent(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  const handleView = (event) => {
    alert(`Event: ${event.name}\nType: ${event.eventType}\nDate: ${new Date(event.eventDate).toLocaleDateString()}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📅 My Events</h1>
            <p className="text-gray-600">{events.length} events</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            ➕ Create Event
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-xl text-gray-600 mb-4">No events scheduled</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Event</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Birthday Party"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Type *</label>
              <select
                name="eventType"
                value={showCustomInput ? 'CUSTOM' : formData.eventType}
                onChange={(e) => {
                  if (e.target.value === 'CUSTOM') {
                    setShowCustomInput(true);
                  } else {
                    setShowCustomInput(false);
                    handleChange(e);
                  }
                }}
                className="input-field"
                required
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
                <option value="CUSTOM">➕ Add Custom Type</option>
              </select>
              
              {/* Custom Event Type Input */}
              {showCustomInput && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customEventType}
                    onChange={(e) => {
                      setCustomEventType(e.target.value);
                      setFormData({...formData, eventType: e.target.value});
                    }}
                    placeholder="Enter custom event type"
                    className="input-field"
                    required
                  />
                </div>
              )}
            </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Event details..."
                  className="input-field"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Select Outfit (Optional)</label>
                <select
                  name="outfitId"
                  value={formData.outfitId}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">No outfit</option>
                  {outfits.map((outfit) => (
                    <option key={outfit.id} value={outfit.id}>
                      {outfit.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;