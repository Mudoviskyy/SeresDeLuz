import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PrescriptionDashboard from './components/PrescriptionDashboard';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('seres_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Handle successful login
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
    setCurrentView('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('seres_user');
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Intercept view change to dashboard if not logged in
  const handleSetView = (view) => {
    if (view === 'dashboard' && !currentUser) {
      setIsLoginOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Header with Navigation & Login Gate */}
      <Header 
        currentView={currentView} 
        setCurrentView={handleSetView}
        currentUser={currentUser}
        setIsLoginOpen={setIsLoginOpen}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' ? (
          <LandingPage 
            setCurrentView={handleSetView} 
            currentUser={currentUser}
            setIsLoginOpen={setIsLoginOpen}
          />
        ) : (
          <PrescriptionDashboard 
            setCurrentView={handleSetView}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Footer with Contact & Legal */}
      <Footer 
        setCurrentView={handleSetView} 
        currentUser={currentUser}
        setIsLoginOpen={setIsLoginOpen}
      />

      {/* Login Modal for Dashboard Access */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}
