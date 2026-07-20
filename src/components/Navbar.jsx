import React, { useState, useEffect } from 'react';
import { 
  Menu, X, MapPin, Users, LogIn, ChevronDown, ChevronUp,
  Home as HomeIcon, Briefcase, Info, Camera, Mail
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const toggleMobileServices = (e) => {
    e.preventDefault();
    setMobileDropdownOpen(!mobileDropdownOpen);
  };

  return (
    <>
      <header className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        {/* Top Utility Bar */}
        <div className="top-bar">
          <div className="container top-bar-container">
            <div className="top-bar-right">
              <Link to="/contact" className="top-tab-white">Request Talent</Link>
              <Link to="/contact" className="top-link"><MapPin size={13} /> Office Locations</Link>
              <Link to="/contact" className="top-link"><Users size={13} /> Associate Support</Link>
              <a href="#" className="top-link login-link"><LogIn size={13} /> Associate Login</a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="navbar">
          <div className="container nav-container">
            <NavLink to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
              ELVO <span className="highlight">HR</span>
            </NavLink>
            
            {/* Desktop Navigation links with Icons */}
            <div className="desktop-links">
              <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
                <HomeIcon size={16} className="nav-icon-inline" /> Home
              </NavLink>
              
              <div 
                className="nav-dropdown-wrapper"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <NavLink to="/services" className={({ isActive }) => `dropdown-trigger ${isActive ? "active-link" : ""}`}>
                  <Briefcase size={16} className="nav-icon-inline" /> Our Services <ChevronDown size={12} className={`caret-icon ${servicesDropdownOpen ? 'rotated' : ''}`} />
                </NavLink>
                <div className={`dropdown-menu ${servicesDropdownOpen ? 'show' : ''}`}>
                  <Link to="/services">Temporary Staffing</Link>
                  <Link to="/services">Permanent Recruitment</Link>
                  <Link to="/services">Payroll Management</Link>
                  <Link to="/services">Compliance Services</Link>
                  <Link to="/services">Employer of Record (EOR)</Link>
                </div>
              </div>

              <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>
                <Info size={16} className="nav-icon-inline" /> About Us
              </NavLink>
              <NavLink to="/careers" className={({ isActive }) => isActive ? "active-link" : ""}>
                <Users size={16} className="nav-icon-inline" /> Careers
              </NavLink>
              <NavLink to="/life-at-elvo" className={({ isActive }) => isActive ? "active-link" : ""}>
                <Camera size={16} className="nav-icon-inline" /> Life at ELVO
              </NavLink>
              <NavLink to="/contact" className="btn btn-primary nav-cta">
                <Mail size={16} /> Contact Us
              </NavLink>
            </div>

            {/* Mobile Toggle Button */}
            <button 
              className={`mobile-toggle-btn ${mobileMenuOpen ? 'open' : ''}`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Translucent Backdrop Overlay */}
      <div 
        className={`nav-backdrop ${mobileMenuOpen ? 'show' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Slide-out Mobile Navigation Drawer with Icons */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="logo">ELVO <span className="highlight">HR</span></div>
          <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <div className="drawer-links">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "drawer-link active-link" : "drawer-link"}>
            <HomeIcon size={18} className="nav-icon-inline" /> Home
          </NavLink>
          
          <div className="drawer-dropdown-section">
            <a href="#" className="drawer-link dropdown-toggle" onClick={toggleMobileServices}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase size={18} /> Our Services
              </span>
              {mobileDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </a>
            <div className={`drawer-submenu ${mobileDropdownOpen ? 'expanded' : ''}`}>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>Temporary Staffing</Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>Permanent Recruitment</Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>Payroll Management</Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>Compliance Services</Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>Employer of Record (EOR)</Link>
            </div>
          </div>

          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "drawer-link active-link" : "drawer-link"}>
            <Info size={18} className="nav-icon-inline" /> About Us
          </NavLink>
          <NavLink to="/careers" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "drawer-link active-link" : "drawer-link"}>
            <Users size={18} className="nav-icon-inline" /> Careers
          </NavLink>
          <NavLink to="/life-at-elvo" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "drawer-link active-link" : "drawer-link"}>
            <Camera size={18} className="nav-icon-inline" /> Life at ELVO
          </NavLink>
          
          <div className="drawer-cta-wrapper">
            <NavLink to="/contact" className="btn btn-primary drawer-cta" onClick={() => setMobileMenuOpen(false)}>
              <Mail size={18} /> Contact Us
            </NavLink>
          </div>
        </div>

        <div className="drawer-footer">
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="drawer-footer-link"><MapPin size={14} /> Offices</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="drawer-footer-link"><Users size={14} /> Support</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
