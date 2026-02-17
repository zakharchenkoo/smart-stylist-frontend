import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),  
  getUser: (userId) => api.get(`/users/${userId}`),
  getAllUsers: () => api.get('/users'),
};

// Clothes API
export const clothesAPI = {
  getAllClothes: (userId) => api.get(`/clothes/user/${userId}`),
  getClothesById: (id) => api.get(`/clothes/${id}`),
  addClothes: (clothesData) => api.post('/clothes', clothesData),
  updateClothes: (id, clothesData) => api.put(`/clothes/${id}`, clothesData),
  deleteClothes: (id) => api.delete(`/clothes/${id}`),
  updateClothes: (id, data) => api.put(`/clothes/${id}`, data),
  getClothesByCategory: (userId, category) => 
    api.get(`/clothes/user/${userId}/category/${category}`),
};

// Outfit API
export const outfitAPI = {
  getAllOutfits: (userId) => api.get(`/outfits/user/${userId}`),
  getOutfitById: (id) => api.get(`/outfits/${id}`),
  createOutfit: (outfitData) => api.post('/outfits', outfitData),
  updateOutfit: (id, outfitData) => api.put(`/outfits/${id}`, outfitData),
  deleteOutfit: (id) => api.delete(`/outfits/${id}`),
};

// Event API
export const eventAPI = {
  getAllEvents: (userId) => api.get(`/events/user/${userId}`),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

// AI Chat API
export const aiChatAPI = {
  startChat: () => api.get('/ai-chat/start'),
  
  sendMessage: (userId, messages) => api.post('/ai-chat/message', {
    userId,
    messages
  })
};

export default api;