import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployerDashboard from './pages/EmployerDashboard';
import BlockchainVerification from './pages/BlockchainVerification';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-white selection:bg-neon-blue/30 overflow-x-hidden">
          {/* Background Radial Glows */}
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full" />
          </div>

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employer" element={<EmployerDashboard />} />
            <Route path="/verify" element={<BlockchainVerification />} />
          </Routes>
        </div>
      </LanguageProvider>
    </Router>
  );
}

export default App;
