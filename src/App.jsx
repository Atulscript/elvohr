import React, { lazy, Suspense } from 'react';
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

import './App.css';

function App() {
  return (
    <Router basename="/elvohr">
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
    </Router>
  );
}

export default App;
