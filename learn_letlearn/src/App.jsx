import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

// Auth Pages
import LoginPage from './pages/auth/Login'
import RegisterPage from './pages/auth/Register'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Main Pages
import Home from './pages/Home'
import Search from './pages/Search'
import Network from './pages/Network'
import Chat from './pages/Chat'
import CreatePost from './pages/CreatePost'
import UserProfile from './pages/UserProfile'
import Career from './pages/Career'

// Common Components
import Navbar from './components/common/Navbar'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/register" replace />;
};

function AppContent() {
  return (
    <>
      <Routes>
        {/* Default route → Register (for new visitors) */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* Auth Routes - Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        
        {/* Admin Routes - Separate from regular auth */}
        <Route path="/secure-admin-panel-l2" element={<AdminLogin />} />
        <Route path="/secure-admin-panel-l2/dashboard" element={<AdminDashboard />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
        <Route path="/career" element={<ProtectedRoute><Career /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/createpost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
  
