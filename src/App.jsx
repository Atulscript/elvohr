import React, { lazy, Suspense, useState, createContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollToTop from './components/ScrollToTop';
import AlertModal from './components/AlertModal';

const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const LifeAtElvoPage = lazy(() => import('./pages/LifeAtElvoPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));

import './App.css';

// Create a global context for triggering the search jobs alert
export const AlertContext = createContext(null);

function App() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const openAlert = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsAlertOpen(true);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <AlertContext.Provider value={openAlert}>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <Navbar />
          <main>
            <Suspense fallback={
              <div className="loading-spinner-wrapper" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                color: 'var(--md-sys-color-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                fontWeight: 500
              }}>
                Loading...
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/life-at-elvo" element={<LifeAtElvoPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<LegalPage />} />
                <Route path="/terms" element={<LegalPage />} />
                <Route path="/cookies" element={<LegalPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <MobileBottomNav />
        </div>
        <AlertModal isOpen={isAlertOpen} onClose={closeAlert} />
      </Router>
    </AlertContext.Provider>
  );
}

export default App;

