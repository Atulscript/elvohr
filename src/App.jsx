import React, { lazy, Suspense, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const LifeAtElvoPage = lazy(() => import('./pages/LifeAtElvoPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const PortalAdminPage = lazy(() => import('./pages/PortalAdminPage'));

import './App.css';

// Create a global context for triggering careers navigation if referenced
export const AlertContext = createContext(() => {
  window.location.href = '/careers';
});

import { useLocation } from 'react-router-dom';
import CtaBanner from './components/CtaBanner';

// Sub-component to have access to router location context
function AppContent() {
  const location = useLocation();
  
  // Hide CTA banner on Contact, Admin, and Legal/Compliance pages
  const hideCta = ['/contact', '/privacy', '/terms', '/cookies', '/portal-admin'].includes(location.pathname);

  return (
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
            <Route path="/careers/:jobId" element={<CareersPage />} />
            <Route path="/life-at-elvo" element={<LifeAtElvoPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/cookies" element={<LegalPage />} />
            <Route path="/portal-admin" element={<PortalAdminPage />} />
          </Routes>
        </Suspense>
      </main>
      {!hideCta && <CtaBanner />}
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function App() {
  const handleSearchJobs = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    window.location.href = '/careers';
  };

  return (
    <AlertContext.Provider value={handleSearchJobs}>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AlertContext.Provider>
  );
}

export default App;

