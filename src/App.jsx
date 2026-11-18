import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PrescriptionDashboard from './components/PrescriptionDashboard';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

function getStoredUser() {
  try {
    const saved = localStorage.getItem('seres_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const [currentView, setCurrentView] = useState(() => {
    const isAdminHash = window.location.hash === '#admin';
    return isAdminHash && getStoredUser() ? 'dashboard' : 'landing';
  });
  const [isLoginOpen, setIsLoginOpen] = useState(() => {
    return window.location.hash === '#admin' && !getStoredUser();
  });

  // Keep URL hash synced with /#admin when on logged-in account area
  useEffect(() => {
    if (currentView === 'dashboard') {
      if (window.location.hash !== '#admin') {
        window.history.replaceState(null, '', '#admin');
      }
    } else if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [currentView]);

  // Listen to manual hash navigation (e.g. visiting /#admin or pressing back)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        if (currentUser) {
          setCurrentView('dashboard');
        } else {
          setIsLoginOpen(true);
        }
      } else if (currentView === 'dashboard') {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser, currentView]);

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
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
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
          <LandingPage />
        ) : (
          <PrescriptionDashboard
            setCurrentView={handleSetView}
          />
        )}
      </main>

      {/* Footer with Contact & Legal */}
      <Footer />

      {/* Login Modal for Dashboard Access */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          if (window.location.hash === '#admin' && !currentUser) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
