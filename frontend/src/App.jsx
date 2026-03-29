import React, { useEffect, useState } from 'react'; // Added useState
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import API from './api/axios';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup'; // Ensure this is imported

function App() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true); // New: Tracks the "Session Check"

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('guru_token');
      
      if (token) {
        try {
          const res = await API.get('/users/me'); 
          setUser({ ...res.data, isSetupComplete: true });
        } catch (err) {
          console.error("Session expired");
          localStorage.removeItem('guru_token');
          setUser(null);
        }
      }
      setLoading(false); // Session check is done (success or failure)
    };
    checkUser();
  }, [setUser]);

  // 1. Prevent "Flash" Redirects
  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-[#ed1c24] font-black uppercase tracking-[0.5em] animate-pulse">
          Initializing Guru...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/setup" element={<Setup />} />
        
        {/* 2. Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />

        {/* 3. Root Redirect Logic */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;