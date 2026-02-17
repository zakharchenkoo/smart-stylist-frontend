import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import EditClothes from './pages/EditClothes';
import AIChatRecommendations from './pages/AIChatRecommendations';


// Pages
import Login from './pages/Login';
import Wardrobe from './pages/Wardrobe';
import AddClothes from './pages/AddClothes';
import Outfits from './pages/Outfits';
import CreateOutfit from './pages/CreateOutfit';
import Events from './pages/Events';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/ai-chat" element={<AIChatRecommendations />} />
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/wardrobe"
            element={
              <ProtectedRoute>
                <Wardrobe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-clothes"
            element={
              <ProtectedRoute>
                <AddClothes />
              </ProtectedRoute>
            }
          />
           <Route path="/edit-clothes/:id" element={<EditClothes />} />
          <Route
            path="/outfits"
            element={
              <ProtectedRoute>
                <Outfits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-outfit"
            element={
              <ProtectedRoute>
                <CreateOutfit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;