import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import DentistDashboard from './pages/DentistDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="App">
      <header style={{ background: '#333', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>OralVis Healthcare</h1>
        {localStorage.getItem('token') && (
          <button onClick={handleLogout} style={{ background: 'red', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Logout
          </button>
        )}
      </header>
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          
          <Route 
            path="/technician" 
            element={
              <ProtectedRoute role="Technician">
                <TechnicianDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dentist" 
            element={
              <ProtectedRoute role="Dentist">
                <DentistDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;